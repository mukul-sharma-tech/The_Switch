# import os
# import sys
# import asyncio
# from dotenv import load_dotenv
# from telegram import Update
# from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
# from ai_agent import TaruAIAgent

# load_dotenv()

# agent = TaruAIAgent()

# TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# # ------------------------------
# # MEMORY: store last 10 messages per user
# # ------------------------------
# user_memory = {}  # {user_id: [{"role": "...", "content": "..."}]}


# def add_to_memory(user_id, role, content):
#     """Save message to memory (limit = last 10)."""
#     if user_id not in user_memory:
#         user_memory[user_id] = []

#     user_memory[user_id].append({"role": role, "content": content})

#     # keep only last 10 messages
#     if len(user_memory[user_id]) > 10:
#         user_memory[user_id] = user_memory[user_id][-10:]


# async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
#     user_id = update.message.from_user.id
#     user_text = update.message.text

#     print(f"[User {user_id}] {user_text}")

#     # save user query
#     add_to_memory(user_id, "user", user_text)

#     # prepare memory context to send to agent
#     history_text = ""
#     if user_id in user_memory:
#         for item in user_memory[user_id]:
#             role = "User" if item["role"] == "user" else "AI"
#             history_text += f"{role}: {item['content']}\n"

#     # final prompt sent to AI
#     final_prompt = f"""You are Taru, a helpful daily-life assistant.
# Here is the last conversation history:

# {history_text}

# User now asks: {user_text}
# Reply helpfully.
# """

#     reply = agent.answer(final_prompt)

#     # save AI reply
#     add_to_memory(user_id, "assistant", reply)

#     await update.message.reply_text(reply)


# def main():
#     app = (
#         ApplicationBuilder()
#         .token(TELEGRAM_BOT_TOKEN)
#         .build()
#     )

#     app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

#     print("Taru Telegram AI Bot is running…")
#     app.run_polling(drop_pending_updates=True)


# if __name__ == "__main__":
#     if sys.platform == "win32":
#         asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
#     main()



# import os
# from dotenv import load_dotenv
# from flask import Flask, request
# from telegram import Update
# from telegram.ext import ApplicationBuilder, ContextTypes
# from ai_agent import TaruAIAgent

# load_dotenv()

# BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
# WEBHOOK_URL = os.getenv("WEBHOOK_URL")  # e.g., https://your-app.onrender.com/webhook

# agent = TaruAIAgent()

# # Flask App
# app = Flask(__name__)

# # Telegram Bot
# application = ApplicationBuilder().token(BOT_TOKEN).build()

# # Memory
# user_memory = {}

# def add_to_memory(user_id, role, content):
#     if user_id not in user_memory:
#         user_memory[user_id] = []
#     user_memory[user_id].append({"role": role, "content": content})
#     if len(user_memory[user_id]) > 10:
#         user_memory[user_id] = user_memory[user_id][-10:]


# @app.post("/webhook")
# async def webhook():
#     """Telegram sends updates here."""
#     data = request.get_json()

#     update = Update.de_json(data, application.bot)
#     user_id = update.message.from_user.id
#     user_text = update.message.text

#     add_to_memory(user_id, "user", user_text)

#     # Build history
#     history_text = ""
#     for item in user_memory.get(user_id, []):
#         role = "User" if item["role"] == "user" else "AI"
#         history_text += f"{role}: {item['content']}\n"

#     final_prompt = f"""
# You are Taru, a helpful daily-life assistant.
# Here is the last conversation history:

# {history_text}

# User now asks: {user_text}
# Reply helpfully.
# """

#     reply = agent.answer(final_prompt)
#     add_to_memory(user_id, "assistant", reply)

#     await application.bot.send_message(chat_id=user_id, text=reply)

#     return "OK"


# @app.get("/")
# def home():
#     return "Taru AI Bot is running with Flask Webhook! 🚀"


# if __name__ == "__main__":
#     # Set webhook once
#     import requests
#     requests.get(
#         f"https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url={WEBHOOK_URL}"
#     )

#     app.run(host="0.0.0.0", port=10000)


from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
import os
from ai_agent import TaruAIAgent

agent = TaruAIAgent()

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    reply = agent.answer(update.message.text)
    await update.message.reply_text(reply)

async def main():
    app = ApplicationBuilder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
    app.add_handler(MessageHandler(filters.TEXT, handle_message))
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
