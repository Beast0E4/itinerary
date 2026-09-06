from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

from src.tools import ALL_TOOLS
from src.config.llm_config import LLM_API_KEY, LLM_MODEL
from src.prompts.renderer import build_system_prompt


# Initialize the model correctly
chat_model = ChatGroq(model=LLM_MODEL, api_key=LLM_API_KEY)

# Create the agent graph
agent = create_agent(
    model=chat_model,
    tools=ALL_TOOLS,
    system_prompt=build_system_prompt (),
)

# Invoke the agent
result = agent.invoke(
    {"messages": [{"role": "user", "content": "I want to travel from Thrissur to Dhanbad. Tell me whether leaving tomorrow would be a good choice or not?"}]}
)

# Iterate through the message history to expose tool_calls, tool_ids, and responses
for msg in result["messages"]:
    
    # 1. Human Request
    if isinstance(msg, HumanMessage):
        print(f"👤 USER: {msg.content}\n")
    
    # 2. AI Responses & Tool Requests
    elif isinstance(msg, AIMessage):
        # The AI's conversational response (if any)
        if msg.content:
            print(f"🤖 AI: {msg.content}")
        
        # The AI's request to use a tool (contains the tool_id and args)
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            for tool_call in msg.tool_calls:
                print(f"🛠️  TOOL CALL INITIATED:")
                print(f"   - Tool Name: {tool_call['name']}")
                print(f"   - Tool ID: {tool_call['id']}")
                print(f"   - Arguments: {tool_call['args']}\n")
                
    # 3. Tool Execution Results
    elif isinstance(msg, ToolMessage):
        # The data returned by your custom Python tools
        print(f"✅ TOOL RESULT:")
        print(f"   - Linked Tool ID: {msg.tool_call_id}")
        print(f"   - Tool Name: {msg.name}")
        print(f"   - Output Data: {msg.content}\n")

print("-" * 40)
print("🏁 FINAL OUTPUT STRING:")
print(result["messages"][-1].content)