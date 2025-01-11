from flask import jsonify, make_response, request

from application import app
from application.utils import initial_init_data_checker


@app.route('/api/auth', methods=['GET', 'POST'])
@initial_init_data_checker
def telegram_auth():
    response = make_response(jsonify({'status': 'Cookie was set!'}))
    response.set_cookie('initData', request.get_json().get('initData'), path='/', httponly=True, secure=True, samesite='None')
    response.status_code = 200
    return response
