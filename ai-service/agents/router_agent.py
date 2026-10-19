from config.llm import generate

def router_agent(query):

    prompt = f"""
Classify the query into exactly one category:

doctor
hospital
emergency
report
general_health
non_medical

doctor = specific symptoms or conditions that need a specialist referral
         (e.g. "my finger is broken", "I have chest pain", "eye ache").

hospital = questions about hospitals, hospital services, or finding a hospital.

emergency = urgent/life-threatening situations needing immediate care
            (e.g. accident, severe bleeding, unconsciousness, heart attack).

report = only medical reports, blood reports,
         prescriptions, MRI, CT scan, X-ray etc.

general_health = general health, wellness, nutrition, diet, fitness, exercise,
                 sleep, hygiene, healthy lifestyle, or preventive-care questions
                 that are NOT about a specific symptom or diagnosis
                 (e.g. "what food should I eat for good health",
                 "how much water should I drink daily",
                 "how can I improve my sleep", "good exercises for back health").

non_medical = anything unrelated to health/medicine: sports, movies, programming,
              cryptocurrency, research papers, blockchain, college projects, etc.

When in doubt between general_health and non_medical, prefer general_health if the
query has any plausible connection to a person's health, body, diet, or wellbeing.

Query:
{query}

Return only one word.
"""

    return generate(prompt).strip().lower()