from flask import jsonify, make_response, request

from application import app
from application.queries.orm import SyncORM
from application.utils import initial_init_data_checker
from application.utils.init_data import TelegramInitData


@app.route('/api/auth', methods=['GET', 'POST'])
@initial_init_data_checker
def telegram_auth():
    telegram_data = TelegramInitData(request.cookies.get('initData'))
    user_data = telegram_data.to_dict().get('user')
    user_id = user_data.get('id')
    
    response = make_response(jsonify({'status': SyncORM.get_user_status(user_id)}))
    response.set_cookie('initData', request.get_json().get('initData'), path='/', httponly=True, secure=True, samesite='None')
    response.status_code = 200
    
    return response
