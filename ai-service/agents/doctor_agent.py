from config.llm import generate

def doctor_agent(query):

    prompt = f"""
    You are a medical specialist assistant.

    User Query:
    {query}

    Suggest:

    1. Doctor specialization
    2. Possible causes
    3. General advice

    Do not provide diagnosis.
    """

    return generate(prompt)