from functools import wraps

from flask import request, jsonify

from application.queries.orm import SyncORM
from application.utils.init_data import TelegramInitData
from config.config import settings


def init_data_checker(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        init_data = request.data.get('initData')
        print(f'\n\n\n{init_data}\n\n\n')
        if not init_data:
            return jsonify({'error': 'No initData'}), 400
        
        telegram_data = TelegramInitData(init_data)
        bot_token = settings.TELEGRAM_BOT_TOKEN
        if not telegram_data.validate(bot_token, lifetime=3600):  # lifetime in seconds
            return jsonify({'status': 'Not authorized'}), 401 # redirect to error

        user_data = telegram_data.to_dict().get('user')
        if user_data is None:
            return jsonify({'status': 'Not authorized'}), 401 # redirect to error

        telegram_user_id = user_data.get('id')
        all_users = SyncORM.get_all_users()
        for user in all_users:
            if user.id == telegram_user_id:
                return func(*args, **kwargs)
        # return func(*args, **kwargs)
            
        return jsonify({'status': 'Not authorized'}), 401 # redirect to error

    return wrapper
