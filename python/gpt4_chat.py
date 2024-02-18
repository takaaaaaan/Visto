# gpt4_chat.py
import openai
import asyncio

openai.api_key = "sk-"


async def chat_with_gpt4(message):
    response = await openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message["content"]
