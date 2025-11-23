from langchain_google_genai import ChatGoogleGenerativeAI

class TaruAIAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.4
        )

    def answer(self, query):
        prompt = f"""
        You are **Taru**, a friendly daily-life helper AI.
        Answer in simple Hindi or English based on the user's message.

        Rules:
        - Keep answers short (2–4 lines)
        - Actionable steps
        - No risky legal/medical instructions
        - Use simple language
        - Fit for low-bandwidth use

        User: {query}
        """

        res = self.llm.invoke(prompt)
        return res.content
