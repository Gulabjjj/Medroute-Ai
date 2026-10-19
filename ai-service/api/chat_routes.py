from fastapi import APIRouter
from pydantic import BaseModel

from graph.medroute_graph import graph

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(request: ChatRequest):

    result = graph.invoke(
        {
            "query": request.message
        }
    )

    return {
        "route": result["route"],
        "response": result["response"]
    }