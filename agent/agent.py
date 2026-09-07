from langchain.agents import create_agent

from src.models.providers import build_chat_model
from src.tools import ALL_TOOLS
from src.prompts.renderer import build_system_prompt

def run_agent (request_data: dict) -> dict:
    llm, provider = build_chat_model ()
    
    agent = create_agent (
        model=llm,
        tools=ALL_TOOLS,
        system_prompt=build_system_prompt ()
    )
        
    result = agent.invoke ({
        "messages": [
            {"role": "user", "content": request_data["input"]}
        ]
    })
    
    return {"output": result["messages"][-1].content}