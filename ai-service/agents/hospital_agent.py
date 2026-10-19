from config.llm import generate

def hospital_agent(query):

    prompt = f"""
You are a medical AI assistant.

First determine whether the user's question is related to:
- Health
- Diseases
- Symptoms
- Medicines
- Hospitals
- Doctors
- Medical Reports
- Healthcare

If the query is NOT medical, respond ONLY with:

"I am MedRoute AI. Please ask only medical or healthcare-related questions."

User Query:
{query}
"""

    return generate(prompt)