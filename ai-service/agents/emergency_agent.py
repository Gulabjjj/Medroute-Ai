from config.llm import generate

def emergency_agent(query):

    prompt = f"""
    You are an emergency medical assistant.

    User Query:
    {query}

    Determine:

    1. Is this a medical emergency?
    2. Why?
    3. What immediate actions should be taken?
    4. Should the patient seek urgent medical attention?

    Use simple language.
    """

    return generate(prompt)