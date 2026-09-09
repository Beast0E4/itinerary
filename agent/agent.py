from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from src.models.providers import build_chat_model
from src.tools import ALL_TOOLS
from src.prompts.renderer import build_system_prompt
from src.models.plan import AiTripPlanResponse

def build_trip_agent():
    llm, _provider = build_chat_model()

    return create_agent(
        model=llm,
        tools=ALL_TOOLS,
        system_prompt=build_system_prompt(),
        response_format=ProviderStrategy(schema=AiTripPlanResponse),
        name="TripPlanner",
    )

async def run_agent(request_data: dict):
    agent = build_trip_agent()

    async for event in agent.astream_events(
        {"messages": [{"role": "user", "content": request_data["input"]}]},
        version="v2",
    ):
        yield event