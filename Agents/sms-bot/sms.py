import os
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv
from ai_agent import TaruAIAgent

load_dotenv()

app = Flask(__name__)

agent = TaruAIAgent()

# In-memory conversation store: { "user_mobile": [messages...] }
conversation_memory = {}

MAX_MEMORY = 10

def add_to_memory(user, role, text):
    if user not in conversation_memory:
        conversation_memory[user] = []
    conversation_memory[user].append({"role": role, "text": text})
    # keep last 10
    conversation_memory[user] = conversation_memory[user][-MAX_MEMORY:]


@app.route("/sms", methods=["POST"])
def sms_reply():
    user_number = request.form.get("From")
    incoming_msg = request.form.get("Body")

    add_to_memory(user_number, "user", incoming_msg)

    # Prepare context string
    history_text = "\n".join(
        [f"{m['role']}: {m['text']}" for m in conversation_memory[user_number]]
    )

    final_prompt = f"""
    You are Taru, a helpful assistant for the general public.
    Use conversation history to give accurate responses.

    Conversation so far:
    {history_text}

    User: {incoming_msg}
    """

    reply = agent.answer(final_prompt)

    add_to_memory(user_number, "assistant", reply)

    resp = MessagingResponse()
    resp.message(reply)

    return str(resp)


if __name__ == "__main__":
    print("Taru SMS Agent running on port 5000")
    app.run(port=5000, debug=True)
