from flask import jsonify, request

from application import app
from application.queries.orm import SyncORM
from application.utils import init_data_checker
from application.utils.init_data import TelegramInitData


@app.route('/api/market', methods=['GET', 'POST'])
@init_data_checker
def markets():
    telegram_data = TelegramInitData(request.cookies.get('initData'))
    user_data = telegram_data.to_dict().get('user')

    markets = SyncORM.get_all_markets(user_data.get('id'))

    return jsonify({'markets': [market.market_id for market in markets]}), 200
