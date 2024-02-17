# gpt4_chat.py
import openai
import asyncio

openai.api_key = "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"


async def chat_with_gpt4(message):
    response = await openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message["content"]
