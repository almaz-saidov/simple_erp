from flask import jsonify, make_response, request

from application.utils import initial_init_data_checker
from application import app


@app.route('/api/auth', methods=['GET', 'POST'])
@initial_init_data_checker
def telegram_auth():
    response = make_response(jsonify({'status': 'Cookie was set!'}))
    response.set_cookie('initData', request.get_json().get('initData'))
    response.status_code = 200
    # return jsonify({'status': 'authorized'}), 200 # cool
    return response
