from langchain.memory import ConversationBufferWindowMemory
from langchain_google_genai import ChatGoogleGenerativeAI

class TaruAIAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.7
        )

        self.memory = ConversationBufferWindowMemory(k=10)

    def answer(self, user_msg):
        history = self.memory.load_memory_variables({})["history"]

        prompt = f"""
You are Taru – a helpful practical AI guide for the Indian public.
Give simple, direct, trustworthy advice.

Chat history:
{history}

User: {user_msg}
"""

        reply = self.llm.invoke(prompt).content

        self.memory.save_context({"input": user_msg}, {"output": reply})
        return reply
