import os
from dotenv import load_dotenv
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from ai_agent import TaruAIAgent

# Load environment variables (API Keys)
load_dotenv()

app = Flask(__name__)

# Initialize the agent once when the app starts
agent = TaruAIAgent()

@app.route("/sms", methods=['POST'])
def sms_reply():
    # 1. Get the message body and the sender's phone number
    user_text = request.values.get("Body", "")
    user_number = request.values.get("From", "unknown_user")
    
    print(f"Message from {user_number}: {user_text}")

    # 2. Get AI response (passing the phone number for memory tracking)
    ai_reply = agent.answer(user_text, user_number)

    # 3. specific Twilio response format
    resp = MessagingResponse()
    resp.message(ai_reply)
    
    return str(resp)

if __name__ == "__main__":
    # Run on port 5000
    app.run(port=5000, debug=True)