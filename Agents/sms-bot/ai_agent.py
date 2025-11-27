from langchain.memory import ConversationBufferWindowMemory
from langchain_google_genai import ChatGoogleGenerativeAI

class TaruAIAgent:
    def __init__(self):
        # Initialize the Gemini model
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.7
        )
        
        # Dictionary to store memory for each user (Phone Number -> Memory)
        self.user_memories = {}

    def get_user_memory(self, user_id):
        """Retrieve or create a memory buffer for a specific user."""
        if user_id not in self.user_memories:
            self.user_memories[user_id] = ConversationBufferWindowMemory(k=10)
        return self.user_memories[user_id]

    def answer(self, user_msg, user_id):
        # Get memory specific to this phone number
        memory = self.get_user_memory(user_id)
        
        # Load specific history
        history = memory.load_memory_variables({})["history"]

        prompt = f"""
You are Taru – a helpful practical AI guide for the Indian public.
Give simple, direct, trustworthy advice.

Chat history:
{history}

User: {user_msg}
"""
        # Generate response
        response = self.llm.invoke(prompt)
        reply = response.content

        # Save this interaction to the specific user's memory
        memory.save_context({"input": user_msg}, {"output": reply})
        
        return reply