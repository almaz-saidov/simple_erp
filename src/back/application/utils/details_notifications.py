import telegram

from config.config import settings

bot = telegram.Bot(token=settings.TELEGRAM_BOT_TOKEN)


def send_notification(message_text: str, id: int) -> None:
    bot.send_message(chat_id=id, text=message_text)
