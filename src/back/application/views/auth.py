import hashlib
import hmac
import json
import urllib.parse
from datetime import datetime, timedelta
from application import app
from flask import request, jsonify
from application.queries.orm import SyncORM
from config.config import settings


class TelegramInitData:
    '''
    Работа с инициализационными данными
    '''

    def __init__(self, query_string: str):
        parsed_qs: dict = dict(urllib.parse.parse_qsl(query_string))
        if not parsed_qs:
            raise ValueError('Invalid data: query_string is incorrect')
        
        self.hash: str = parsed_qs.pop('hash', None)
        if self.hash is None:
            raise ValueError('Invalid data: "hash" parameter is missing')

        auth_date = parsed_qs.get("auth_date", None)
        if auth_date is None:
            raise ValueError('Invalid data: "auth_date" parameter is missing')
        try:
            self.auth_date = int(auth_date)
        except ValueError:
            raise ValueError('Invalid data: "auth_date" parameter is not a valid integer')

        self.parsed_qs: dict = parsed_qs
    
    def to_dict(self):
        '''
        Превратить строку в словарь
        '''

        parsed_dict = {'hash': self.hash}
        for key, value in self.parsed_qs.items():
            if key in {
                'hash',
                'query_id',
                'chat_type',
                'chat_instance',
                'start_param',
                'signature',
            }:
                parsed_dict[key] = value
            
            elif key in {'auth_date', 'can_send_after'}:
                parsed_dict[key] = int(value)
            elif key in {'user', 'receiver'}:
                try:
                    parsed_dict[key] = json.loads(value)
                except json.decoder.JSONDecodeError:
                    raise ValueError(f'Invalid data: "{key}" parameter is incorrect')
            elif key == 'chat':
                try:
                    parsed_dict[key] = json.loads(value)
                except json.decoder.JSONDecodeError:
                    raise ValueError(f'Invalid data: "chat" parameter is incorrect')
        
        return parsed_dict
    
    def validate(self, bot_token: str, lifetime: int | None = None):
        '''
        Валидация
        '''

        if lifetime is not None:
            auth_date = datetime.fromtimestamp(self.auth_date)
            expire_date = auth_date + timedelta(seconds=lifetime)
            if datetime.now() > expire_date:
                return False
            
        parsed_qs = sorted(self.parsed_qs.items())
        data_check_string = '\n'.join(f'{key}={value}' for key, value in parsed_qs)
        secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

        return calculated_hash == self.hash


@app.route('/api/auth', methods=['GET', 'POST'])
def telegram_auth():
    # if request.method == 'POST':
    try:
        init_data = request.form.get('initData')
        hash_data = request.form.get('csrf_token')
        if not init_data or not hash_data:
            return jsonify({'status': 'not authorized'}), 401 # redirect to error

        telegram_data = TelegramInitData(init_data)
        bot_token = settings.TELEGRAM_BOT_TOKEN
        if not telegram_data.validate(bot_token, lifetime=3600):  # lifetime in seconds
            return jsonify({'status': 'not authorized'}), 401 # redirect to error

        user_data = telegram_data.to_dict().get('user')
        if user_data is None:
            return jsonify({'status': 'not authorized'}), 401 # redirect to error

        telegram_user_id = user_data.get('id')
        all_users = SyncORM.get_all_users()
        for user in all_users:
            if user.id == telegram_user_id:
                return jsonify({'status': 'authorized'}), 200 # cool

        return jsonify({'status': 'not authorized'}), 401 # redirect to error

    except Exception as e:
        return jsonify({'status': 'not authorized'}), 401
    # else:
    #     return jsonify({'redirect_url': '/front/auth'})
