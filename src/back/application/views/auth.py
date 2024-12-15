from flask import jsonify

from application.utils import init_data_checker
from application import app


@app.route('/api/auth', methods=['GET', 'POST'])
@init_data_checker
def telegram_auth():
    return jsonify({'status': 'authorized'}), 200 # cool
