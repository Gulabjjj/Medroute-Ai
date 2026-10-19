from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import shutil
import os

from agents.router_agent import router_agent
from agents.report_agent import report_agent
from config.llm import generate
from rag.pdf_loader import load_pdf
from rag.vector_store import (
    create_vector_store,
    save_vector_store,
    load_vector_store,
)

router = APIRouter()

# In-memory cache so repeated questions in the same process don't hit disk.
# Keyed by filename -> FAISS vector store.
vector_store_cache = {}

NOT_FOUND_MESSAGE = "I couldn't find that information in your uploaded report."


def get_vector_store(filename, file_path=None):
    """
    Resolve a vector store for a given report filename, in order of cost:
    1. In-memory cache (fastest, but lost on process restart/reload/new worker)
    2. Disk-persisted FAISS index (survives restarts, no re-embedding needed)
    3. Rebuild from the original PDF on disk (slowest, only if nothing else exists)

    Returns None if the report can't be found anywhere.
    """

    if filename in vector_store_cache:
        return vector_store_cache[filename]

    vector_store = load_vector_store(filename)

    if vector_store is not None:
        vector_store_cache[filename] = vector_store
        return vector_store

    if file_path is None:
        file_path = f"uploads/{filename}"

    if not os.path.exists(file_path):
        return None

    docs = load_pdf(file_path)
    vector_store = create_vector_store(docs)

    save_vector_store(vector_store, filename)
    vector_store_cache[filename] = vector_store

    return vector_store


@router.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    docs = load_pdf(file_path)
    report_text = "\n".join(doc.page_content for doc in docs)

    # Check if uploaded PDF is a medical report
    route = router_agent(report_text[:3000])

    if route != "report":
        return {
            "analysis": "This is not a medical report.",
            "fileName": file.filename,
            "isReport": False,
        }

    # Build & persist the vector store so /ask-report can reuse it,
    # even across restarts or multiple worker processes.
    vector_store = create_vector_store(docs)
    save_vector_store(vector_store, file.filename)
    vector_store_cache[file.filename] = vector_store

    analysis = report_agent(report_text)

    return {
        "analysis": analysis,
        "fileName": file.filename,
        "isReport": True,
    }


class AskRequest(BaseModel):
    fileName: str
    question: str


@router.post("/ask-report")
async def ask_report(request: AskRequest):

    vector_store = get_vector_store(request.fileName)

    if vector_store is None:
        return {
            "answer": "Report not found. Please re-upload it."
        }

    retrieved_docs = vector_store.similarity_search(request.question, k=4)
    context = "\n".join(doc.page_content for doc in retrieved_docs)

    prompt = f"""
You are a medical report assistant. Use ONLY the report context below to answer the question.
Do not use outside knowledge and do not guess.

Report Context:
{context}

Question:
{request.question}

Rules:
- If the context above answers the question, answer clearly in simple language.
- If the context does NOT contain enough information to answer, or the question is unrelated
  to this report, reply with EXACTLY this sentence and nothing else:
  "{NOT_FOUND_MESSAGE}"
"""

    answer = generate(prompt)

    return {"answer": answer}
