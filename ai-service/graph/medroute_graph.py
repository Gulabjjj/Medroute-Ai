from langgraph.graph import StateGraph
from langgraph.graph import END

from graph.state import GraphState

from graph.nodes import (
    router_node,
    doctor_node,
    hospital_node,
    emergency_node,
    report_node,
    general_health_node,
    non_medical_node,
)

workflow = StateGraph(GraphState)

# Nodes
workflow.add_node(
    "router",
    router_node
)

workflow.add_node(
    "doctor",
    doctor_node
)

workflow.add_node(
    "hospital",
    hospital_node
)

workflow.add_node(
    "emergency",
    emergency_node
)

workflow.add_node(
    "report",
    report_node
)

workflow.add_node(
    "general_health",
    general_health_node
)

workflow.add_node(
    "non_medical",
    non_medical_node
)

# Entry Point
workflow.set_entry_point(
    "router"
)


def route_decision(state):

    route = state["route"]

    if route == "doctor":
        return "doctor"

    elif route == "hospital":
        return "hospital"

    elif route == "emergency":
        return "emergency"

    elif route == "report":
        return "report"

    elif route == "general_health":
        return "general_health"

    elif route == "non_medical":
        return "non_medical"

    return "non_medical"


workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "doctor": "doctor",
        "hospital": "hospital",
        "emergency": "emergency",
        "report": "report",
        "general_health": "general_health",
        "non_medical": "non_medical",
    },
)

workflow.add_edge(
    "doctor",
    END
)

workflow.add_edge(
    "hospital",
    END
)

workflow.add_edge(
    "emergency",
    END
)

workflow.add_edge(
    "report",
    END
)

workflow.add_edge(
    "general_health",
    END
)

workflow.add_edge(
    "non_medical",
    END
)

graph = workflow.compile()