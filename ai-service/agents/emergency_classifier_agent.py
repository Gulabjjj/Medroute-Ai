import json

from config.llm import generate

# Must stay in sync with the `specialization` labels used in
# server/controllers/emergencyController.js (SYMPTOM_SPECIALIZATION_MAP).
ALLOWED_SPECIALIZATIONS = [
    "General Surgery",
    "Cardiology",
    "Neurology",
    "Pulmonology",
    "Orthopedics",
    "Dermatology",
    "Psychiatry",
    "Pediatrics",
    "Gynecology",
    "Gastroenterology",
    "Ophthalmology",
    "ENT",
    "Nephrology",
    "General Medicine",
]

ALLOWED_LEVELS = ["HIGH", "MEDIUM", "LOW"]

# Used only when the AI service call itself fails/errors (network down,
# bad response, etc.) - NOT used for genuinely non-symptom input, since in
# that case the AI successfully told us so and Node should just show the
# short "not a symptom" message instead of guessing.
FALLBACK_RESULT = {
    "isSymptom": True,
    "specialization": "General Medicine",
    "emergencyLevel": "LOW",
    "immediateActions": [],
}

NOT_SYMPTOM_RESULT = {
    "isSymptom": False,
}


def _clean_json(raw):
    """Strip markdown code fences some models add around JSON output."""
    cleaned = raw.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    return cleaned


def classify_emergency(symptom):
    """
    Uses the LLM to:
      0. Decide whether the input actually describes a physical/mental
         health symptom, injury, or medical emergency situation at all.
         General knowledge questions ("what is data structure and
         algorithm"), lifestyle/nutrition questions ("which fruit should
         I eat"), or anything else that isn't a symptom/emergency
         description gets rejected here with isSymptom=False, and Node
         should just show a short one-line notice - no emergency level,
         no actions, no doctor/hospital lookup.

    If it IS a genuine symptom/emergency description, also classify:
      - a medical speciality (from a fixed, known list) -- used to look up
        registered hospitals/doctors and vetted fallback advice.
      - an emergency severity level (HIGH / MEDIUM / LOW)
      - a short list of immediate actions tailored to what the person
        actually described (e.g. "bleeding heavily from my leg after a
        road accident" gets bleeding-control steps, not a generic
        "monitor symptoms" list).

    The Node side treats `immediateActions` as advisory: if it looks
    sane (a handful of short strings) it's shown to the user, otherwise
    Node falls back to its own vetted, specialization-keyed list.
    """

    options = ", ".join(ALLOWED_SPECIALIZATIONS)

    prompt = f"""You are a medical triage classifier and first-aid assistant.

Patient input:
"{symptom}"

Step 0 - Decide: does this input actually describe a physical or mental health
SYMPTOM, injury, illness, or medical emergency situation happening to a person
right now (e.g. "chest pain", "I fell and my leg is bleeding", "I feel dizzy
and nauseous")?

It is NOT a symptom/emergency if it is:
- a general knowledge / factual / how-to question unrelated to a person's
  own health right now (e.g. "what is data structure and algorithm",
  "who is the prime minister")
- a general lifestyle, diet, or nutrition preference question with no
  described symptom (e.g. "which fruit should I eat", "what food is
  good for health")
- small talk, or any other non-medical-emergency topic

If it is NOT a symptom/emergency description, respond with ONLY this JSON and
nothing else:
{{"isSymptom": false}}

Otherwise, continue:

Step 1 - Pick exactly ONE speciality from this fixed list that best matches the
description (match by clinical meaning, not exact wording):
{options}

Guidance:
- Accidents, heavy/severe bleeding, open wounds, burns, unconsciousness, or choking
  -> "General Surgery" (trauma/first-aid), even if other symptoms like dizziness
  are also mentioned.
- "my finger is broken" -> Orthopedics. "eye ache" -> Ophthalmology.
- If nothing else fits, use "General Medicine".

Step 2 - Decide an emergency severity level:
- HIGH: life-threatening, needs immediate emergency care (e.g. heart attack, stroke,
  severe/heavy bleeding, choking, unconsciousness, major accident)
- MEDIUM: needs prompt medical attention soon but is not immediately life-threatening
- LOW: manageable with routine care

Step 3 - Write 3 to 5 short, specific, safe immediate first-aid/self-care actions
for exactly this situation (not generic filler, and not advice for a different
body part or symptom than what was described - e.g. a plain cough with no
mention of the throat or voice should NOT get "rest your voice", but SHOULD get
actions like staying hydrated, warm fluids, or a humidifier). Each item should
be a plain instruction under 20 words. Do not give a diagnosis. If the
situation is serious, the first action should be to call emergency services.

Respond with ONLY a JSON object and nothing else, in exactly this format:
{{
  "isSymptom": true,
  "specialization": "<one item from the list above, exact spelling>",
  "emergencyLevel": "HIGH|MEDIUM|LOW",
  "immediateActions": ["<action 1>", "<action 2>", "<action 3>"]
}}
"""

    try:
        raw = generate(prompt)
        data = json.loads(_clean_json(raw))
    except Exception:
        return FALLBACK_RESULT

    if data.get("isSymptom") is False:
        return NOT_SYMPTOM_RESULT

    specialization = data.get("specialization", "General Medicine")
    emergency_level = data.get("emergencyLevel", "LOW")
    immediate_actions = data.get("immediateActions", [])

    if specialization not in ALLOWED_SPECIALIZATIONS:
        specialization = "General Medicine"

    if emergency_level not in ALLOWED_LEVELS:
        emergency_level = "LOW"

    if not isinstance(immediate_actions, list):
        immediate_actions = []

    immediate_actions = [
        str(item).strip()
        for item in immediate_actions
        if isinstance(item, (str, int, float)) and str(item).strip()
    ][:6]

    return {
        "isSymptom": True,
        "specialization": specialization,
        "emergencyLevel": emergency_level,
        "immediateActions": immediate_actions,
    }
