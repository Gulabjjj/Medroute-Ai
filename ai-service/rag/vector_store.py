import os

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_community.vectorstores import (
    FAISS
)

from rag.embeddings import get_embeddings

VECTOR_STORE_DIR = "vector_stores"


def create_vector_store(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(
        documents
    )

    embeddings = get_embeddings()

    vector_store = FAISS.from_documents(
        chunks,
        embeddings
    )

    return vector_store


def save_vector_store(vector_store, name):
    """Persist a FAISS index to disk under vector_stores/<name>/"""

    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

    path = os.path.join(VECTOR_STORE_DIR, name)

    vector_store.save_local(path)


def load_vector_store(name):
    """Load a previously persisted FAISS index, or None if it doesn't exist."""

    path = os.path.join(VECTOR_STORE_DIR, name)

    if not os.path.exists(path):
        return None

    embeddings = get_embeddings()

    return FAISS.load_local(
        path,
        embeddings,
        allow_dangerous_deserialization=True
    )
