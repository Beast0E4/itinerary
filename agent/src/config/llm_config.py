import os

from dotenv import load_dotenv
from pathlib import Path

load_dotenv ()

LLM_API_KEY = os.getenv ('LLM_API_KEY')

LLM_MODEL = os.getenv ('LLM_MODEL')

PROJECT_ROOT = Path(__file__).parent.parent

PROMPTS_DIR = PROJECT_ROOT / "prompts" / "templates"

print (f"{PROMPTS_DIR}")