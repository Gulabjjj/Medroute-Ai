from typing import TypedDict


class GraphState(TypedDict):
    query: str
    route: str
    response: str