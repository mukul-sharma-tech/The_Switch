import os
from dotenv import load_dotenv
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from ai_agent import TaruAIAgent

load_dotenv()

app = Flask(__name__)
agent = TaruAIAgent()

@app.post("/sms")
def sms_reply():
    user_text = request.form.get("Body", "")
    print("User:", user_text)

    ai_reply = agent.answer(user_text)

    resp = MessagingResponse()
    resp.message(ai_reply)
    return str(resp)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
