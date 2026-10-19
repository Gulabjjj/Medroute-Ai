# test_groq.py

from config.llm import generate

print(
    generate(
        "What causes fever?"
    )
)