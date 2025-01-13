import urllib, json, hashlib, hmac
from datetime import datetime, timedelta


class TelegramInitData:
    '''
    Работа с инициализационными данными
    '''

    def __init__(self, query_string: str):
        parsed_qs: dict = dict(urllib.parse.parse_qsl(query_string))
        print(parsed_qs)
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