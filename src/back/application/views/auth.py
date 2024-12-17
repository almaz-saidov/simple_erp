from flask import jsonify, make_response, request

from application.utils.init_data import TelegramInitData
from application.utils import initial_init_data_checker
from application import app


@app.route('/api/auth', methods=['GET', 'POST'])
@initial_init_data_checker
def telegram_auth():
    init_data = TelegramInitData(request.get_json().get('initData'))
    response = make_response('Cookie was set!')
    response.set_cookie('initData', init_data)
    response.status_code = 200
    # return jsonify({'status': 'authorized'}), 200 # cool
    return response
