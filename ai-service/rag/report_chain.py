from config.llm import generate

from rag.pdf_loader import load_pdf
from rag.vector_store import (
    create_vector_store
)


def analyze_report(
    pdf_path,
    question="Summarize this medical report"
):

    docs = load_pdf(pdf_path)

    vector_store = create_vector_store(
        docs
    )

    retrieved_docs = (
        vector_store.similarity_search(
            question,
            k=4
        )
    )

    context = "\n".join(
        [
            doc.page_content
            for doc in retrieved_docs
        ]
    )

    prompt = f"""
    Medical Report Context:

    {context}

    Question:
    {question}

    Give:
    1. Summary
    2. Key Findings
    3. Recommendations

    Use simple language.
    """

    response = generate(
        prompt
    )

    return response
