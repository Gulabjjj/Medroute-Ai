const axios = require("axios");

const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");

// Maps symptom/disease keywords to the medical speciality that should be
// searched for among registered hospitals/doctors.
//
// `specialization` is the human-readable label shown in the UI.
// `matchPattern` is a regex *source* used to find that speciality in the
// database, written as a word-root so it matches naming variants like
// "Ophthalmology" vs "Ophthalmologist", or "Orthopedics" vs "Orthopaedic".
const SYMPTOM_SPECIALIZATION_MAP = [
  {
    keywords: ["bleeding", "blood loss", "hemorrhage", "haemorrhage", "wound", "deep cut", "laceration", "road accident", "car accident", "accident", "trauma", "burn", "burns", "unconscious", "unresponsive", "choking", "severe injury", "profuse bleeding", "stab", "gunshot"],
    specialization: "General Surgery",
    matchPattern: "general surg|trauma|surgery",
    emergencyLevel: "HIGH",
    immediateActions: [
      "Call emergency services / ambulance immediately",
      "Apply firm, direct pressure to the wound with a clean cloth to control bleeding",
      "Keep the person lying down and elevate the injured area if possible",
      "Do not remove any embedded object from the wound",
      "Watch for signs of shock (pale skin, rapid breathing, confusion) and keep them warm until help arrives",
    ],
  },
  {
    keywords: ["chest pain", "chest ache", "chest discomfort", "chest tightness", "heart attack", "heart pain", "cardiac", "heart", "chest"],
    specialization: "Cardiology",
    matchPattern: "cardio",
    emergencyLevel: "HIGH",
    immediateActions: [
      "Call emergency services immediately",
      "Sit or lie down",
      "Do not drive yourself",
      "Seek medical help urgently",
    ],
  },
  {
    keywords: ["stroke", "paralysis", "slurred speech", "numbness", "seizure", "dizziness", "headache", "migraine"],
    specialization: "Neurology",
    matchPattern: "neuro",
    emergencyLevel: "HIGH",
    immediateActions: [
      "Call emergency services immediately",
      "Keep patient calm",
      "Monitor breathing",
      "Go to nearest hospital",
    ],
  },
  {
    keywords: ["breathing", "difficulty breathing", "asthma", "shortness of breath", "breathless", "cough", "wheezing", "chest congestion"],
    specialization: "Pulmonology",
    matchPattern: "pulmo",
    emergencyLevel: "MEDIUM",
    immediateActions: [
      "Sit upright",
      "Stay calm",
      "Seek medical attention",
    ],
  },
  {
    keywords: ["fracture", "broken bone", "bone injury", "joint pain", "back pain", "knee pain", "bone pain", "sprain", "broken", "finger", "arm", "leg", "wrist", "ankle", "bone", "twisted ankle", "injury"],
    specialization: "Orthopedics",
    matchPattern: "orthop",
    emergencyLevel: "MEDIUM",
    immediateActions: [
      "Immobilize the affected area",
      "Avoid putting weight on the injury",
      "Apply ice if swelling occurs",
      "Seek medical attention",
    ],
  },
  {
    keywords: ["skin", "rash", "itching", "allergy", "acne", "itchy skin", "skin irritation"],
    specialization: "Dermatology",
    matchPattern: "dermat",
    emergencyLevel: "LOW",
    immediateActions: [
      "Avoid scratching the area",
      "Keep the skin clean and dry",
      "Consult a doctor if it spreads or worsens",
    ],
  },
  {
    keywords: ["anxiety", "panic attack", "depression", "mental health", "suicidal", "stress", "insomnia", "panic"],
    specialization: "Psychiatry",
    matchPattern: "psychiatr",
    emergencyLevel: "MEDIUM",
    immediateActions: [
      "Stay with the person and keep them safe",
      "Speak calmly and avoid confrontation",
      "Seek immediate professional help",
    ],
  },
  {
    keywords: ["child", "infant", "baby"],
    specialization: "Pediatrics",
    matchPattern: "p(a)?ediatr",
    emergencyLevel: "MEDIUM",
    immediateActions: [
      "Keep the child calm and comfortable",
      "Monitor temperature and symptoms",
      "Seek medical attention",
    ],
  },
  {
    keywords: ["pregnancy", "labor", "pregnant", "periods", "menstrual", "menstruation"],
    specialization: "Gynecology",
    matchPattern: "gyn(a)?ec",
    emergencyLevel: "HIGH",
    immediateActions: [
      "Call emergency services immediately",
      "Keep the patient lying on her side",
      "Go to the nearest hospital",
    ],
  },
  {
    keywords: ["stomach", "abdominal pain", "vomiting", "nausea", "diarrhea", "acidity", "indigestion", "stomach ache"],
    specialization: "Gastroenterology",
    matchPattern: "gastro",
    emergencyLevel: "LOW",
    immediateActions: [
      "Stay hydrated",
      "Avoid solid food temporarily",
      "Consult a doctor if pain persists",
    ],
  },
  {
    keywords: ["eye", "vision", "blurred vision", "eye pain", "eye ache", "itchy eyes", "red eyes"],
    specialization: "Ophthalmology",
    matchPattern: "ophthalm",
    emergencyLevel: "LOW",
    immediateActions: [
      "Avoid rubbing the eyes",
      "Protect the eyes from light and dust",
      "Consult a doctor if symptoms persist",
    ],
  },
  {
    keywords: ["ear", "throat", "sore throat", "hearing loss", "nose block", "sinus", "ear pain", "earache"],
    specialization: "ENT",
    matchPattern: "\\bent\\b|oto.?laryngo",
    emergencyLevel: "LOW",
    immediateActions: [
      "Stay hydrated",
      "Avoid loud noises or straining the throat",
      "Consult a doctor if symptoms persist",
    ],
  },
  {
    keywords: ["kidney", "urine", "urination", "urinary"],
    specialization: "Nephrology",
    matchPattern: "nephro",
    emergencyLevel: "MEDIUM",
    immediateActions: [
      "Stay hydrated unless advised otherwise",
      "Monitor symptoms closely",
      "Seek medical attention",
    ],
  },
];

const DEFAULT_RESULT = {
  specialization: "General Medicine",
  matchPattern: "general medicine|general physician|family medicine|internal medicine|\\bgp\\b|mbbs",
  emergencyLevel: "LOW",
  immediateActions: [
    "Monitor symptoms",
    "Drink water",
    "Consult a doctor if symptoms worsen",
  ],
};

const matchSymptom = (text) => {
  for (const entry of SYMPTOM_SPECIALIZATION_MAP) {
    if (entry.keywords.some((keyword) => text.includes(keyword))) {
      return entry;
    }
  }

  return DEFAULT_RESULT;
};

// Lookup table from specialization label -> its vetted matchPattern/
// immediateActions, so the AI classifier only ever has to return a label
// (never freeform medical advice text).
const SPECIALIZATION_LOOKUP = {};
SYMPTOM_SPECIALIZATION_MAP.forEach((entry) => {
  SPECIALIZATION_LOOKUP[entry.specialization] = entry;
});
SPECIALIZATION_LOOKUP[DEFAULT_RESULT.specialization] = DEFAULT_RESULT;

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Ask the Python AI service to classify freeform symptom text into one of
// our known specialities. This understands phrasing the static keyword list
// was never taught (e.g. "my finger is broken", "eye ache"), because it's a
// real language model rather than a fixed list of exact phrases.
//
// If the AI service is down/slow/returns something unexpected, this throws
// and the caller falls back to the keyword-based matchSymptom() above, so
// the feature still works even without the Python service running.
const classifyWithAI = async (symptom) => {
  const { data } = await axios.post(
    `${AI_SERVICE_URL}/classify-emergency`,
    { symptom },
    { timeout: 6000 }
  );

  // The AI first decides whether this is even a symptom/emergency
  // description at all (as opposed to a general-knowledge or lifestyle
  // question like "which fruit should I eat"). If it isn't, don't fabricate
  // an emergency level or specialization — the caller shows a short notice
  // instead.
  if (data.isSymptom === false) {
    return { notSymptom: true };
  }

  const entry = SPECIALIZATION_LOOKUP[data.specialization];

  if (!entry) {
    throw new Error("AI service returned an unrecognized specialization");
  }

  // Prefer AI-generated immediate actions tailored to the *actual* wording of
  // this specific case (e.g. "bleeding heavily from my leg after an accident")
  // over the generic per-speciality defaults, as long as they look sane and safe.
  const aiActions = Array.isArray(data.immediateActions)
    ? data.immediateActions
        .filter((a) => typeof a === "string" && a.trim().length > 0 && a.length <= 160)
        .slice(0, 6)
    : [];

  const immediateActions =
    aiActions.length >= 2 ? aiActions : entry.immediateActions;

  return {
    notSymptom: false,
    specialization: entry.specialization,
    matchPattern: entry.matchPattern,
    immediateActions,
    // Trust the AI's contextual severity read over the static default,
    // but only if it's one of our three known levels.
    emergencyLevel: ["HIGH", "MEDIUM", "LOW"].includes(data.emergencyLevel)
      ? data.emergencyLevel
      : entry.emergencyLevel,
  };
};

const getEmergencyHelp =
  async (req, res) => {
    try {
      const { symptom } =
        req.body;

      if (!symptom || !symptom.trim()) {
        return res.status(400).json({
          message: "Please describe the symptom or condition",
        });
      }

      const text =
        symptom.toLowerCase();

      let matched;

      try {
        matched = await classifyWithAI(symptom);
      } catch (aiError) {
        // AI service unavailable, slow, or returned something unexpected —
        // fall back to the static keyword matcher so the feature still works.
        matched = { notSymptom: false, ...matchSymptom(text) };
      }

      if (matched.notSymptom) {
        return res.json({
          isSymptom: false,
          message:
            "This doesn't look like a medical symptom or emergency. Please describe what's physically or mentally happening so we can help.",
        });
      }

      const {
        specialization,
        matchPattern,
        emergencyLevel,
        immediateActions,
      } = matched;

      // Look up registered hospitals and doctors that match the required speciality.
      // matchPattern is a word-root regex so naming variants (e.g. "Ophthalmology"
      // vs "Ophthalmologist", "Orthopedics" vs "Orthopaedic") still match.
      const specializationRegex = new RegExp(matchPattern, "i");

      let hospitals = await Hospital.find({
        specialization: specializationRegex,
      }).sort({ createdAt: -1 });

      let doctors = await Doctor.find({
        specialization: specializationRegex,
      }).sort({ createdAt: -1 });

      const response = {
        emergencyLevel,
        immediateActions,
        recommendedSpecialization: specialization,
        hospitals,
        doctors,
        notifications: [],
      };

      // No one registered under the exact matched speciality. Rather than
      // showing an empty result, fall back to whatever hospitals/doctors
      // are registered so the person still has someone to contact —
      // this matters most for LOW/MEDIUM cases where a general doctor is
      // a reasonable substitute for a narrow specialist match.
      if (hospitals.length === 0) {
        const fallbackHospitals = await Hospital.find({})
          .sort({ createdAt: -1 })
          .limit(3);

        if (fallbackHospitals.length > 0) {
          response.hospitals = fallbackHospitals;
          response.notifications.push(
            `No hospitals specifically listed for ${specialization} — showing other registered hospitals instead.`
          );
        } else {
          response.notifications.push(
            `No hospitals listed for ${specialization} — contact your nearest emergency service.`
          );
        }
      }

      if (doctors.length === 0) {
        // Prefer a general/family physician over a wildly unrelated specialist
        // (e.g. don't hand a knee injury to a Psychiatrist just because they're
        // the most recently registered doctor). Fall back to "any doctor" only
        // if no general physician is registered either.
        const generalRegex = new RegExp(DEFAULT_RESULT.matchPattern, "i");

        let fallbackDoctors = await Doctor.find({
          specialization: generalRegex,
        })
          .sort({ createdAt: -1 })
          .limit(3);

        let usedGeneral = fallbackDoctors.length > 0;

        if (!usedGeneral) {
          fallbackDoctors = await Doctor.find({})
            .sort({ createdAt: -1 })
            .limit(3);
        }

        if (fallbackDoctors.length > 0) {
          response.doctors = fallbackDoctors;
          response.notifications.push(
            usedGeneral
              ? `No ${specialization} specialist registered — showing general physicians instead.`
              : `No doctors specifically listed for ${specialization} — showing other registered doctors instead.`
          );
        } else {
          response.notifications.push(
            `No doctors listed for ${specialization} — visit your nearest ER.`
          );
        }
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getEmergencyHelp,
};