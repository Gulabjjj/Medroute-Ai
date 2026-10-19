from config.llm import generate

def general_health_agent(query):

    prompt = f"""
You are a helpful healthcare assistant answering general health, wellness,
nutrition, fitness, sleep, and lifestyle questions.

User Query:
{query}

Give a clear, practical, and helpful answer using general, well-established
health guidance. You may use short bullet points where useful.

Do not diagnose any medical condition. If the question suggests a specific
symptom or health problem that needs personalized medical attention,
briefly recommend consulting a doctor at the end.
"""

    return generate(prompt)
