from agents.router_agent import router_agent
from agents.doctor_agent import doctor_agent
from agents.hospital_agent import hospital_agent
from agents.emergency_agent import emergency_agent
from agents.report_agent import report_agent
from agents.general_health_agent import general_health_agent


def router_node(state):
    route = router_agent(state["query"])

    state["route"] = route

    return state


def doctor_node(state):
    state["response"] = doctor_agent(
        state["query"]
    )

    return state


def hospital_node(state):
    state["response"] = hospital_agent(
        state["query"]
    )

    return state


def emergency_node(state):
    state["response"] = emergency_agent(
        state["query"]
    )

    return state


def report_node(state):
    state["response"] = report_agent(
        state["query"]
    )

    return state


def general_health_node(state):
    state["response"] = general_health_agent(
        state["query"]
    )

    return state


def non_medical_node(state):

    state["response"] = (
        "I am MedRoute AI. "
        "Please ask only medical or healthcare-related questions."
    )

    return state