import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

def create_app() -> Flask:
    load_dotenv()
    app = Flask(__name__)
    
    cors_origins = os.environ.get("CORS_ORIGINS", "*")
    CORS(app, resources={r"/*": {"origins": cors_origins.split(",")}})
    
    google_api_key = os.environ.get("GOOGLE_API_KEY", "")
    if not google_api_key:
        app.logger.error("GOOGLE_API_KEY not set")
    else:
        genai.configure(api_key=google_api_key)
    
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200
    
    @app.post("/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        question = data.get("message") or data.get("question") or ""
        if not question:
            return jsonify({"error": "Missing 'message' in JSON body"}), 400
        
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            # Add context for student mental health
            prompt = f"""You are Taru, a supportive AI assistant helping students with mental health and academic stress.
            
Student question: {question}

Provide a helpful, empathetic response. If the student seems stressed or struggling, suggest campus resources or coping strategies."""
            
            response = model.generate_content(prompt)
            
            return jsonify({
                "answer": response.text,
                "actions": [],
                "sources": [],
                "confidence": 0.9,
            })
        except Exception as exc:
            app.logger.exception("Chat endpoint error")
            return jsonify({"error": str(exc)}), 500
    
    @app.get("/risk")
    def risk():
        # Simplified risk assessment
        return jsonify({
            "risk_probability": 0.5,
            "reason": "Risk assessment unavailable - using simplified version",
        })
    
    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)


