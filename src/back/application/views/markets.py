from flask import jsonify, request

from application import app
from application.queries.orm import SyncORM
from application.utils import init_data_checker
from application.utils.init_data import TelegramInitData


# @app.get('/api/markets')
# @init_data_checker
# def markets():
#     telegram_data = TelegramInitData(request.cookies.get('initData'))
#     user_data = telegram_data.to_dict().get('user')

#     markets = SyncORM.get_all_markets(user_data.get('id'))

#     return jsonify({'markets': [f'{market.market_id},{market.name},{market.address}' for market in markets]}), 200

@app.get('/api/markets')
@init_data_checker
def markets():
    markets = SyncORM.get_all_markets()

    return jsonify({'records': [{'id': market.market_id, 'name': market.name, 'address': market.address} for market in markets]}), 200
    # markets_list = [
    #     {
    #         'id': market.id,
    #         'name': market.name,
    #         'address': market.address
    #     }
    #     for market in markets
    # ]

    # return jsonify({'markets': markets_list}), 200


@app.post('/api/markets')
@init_data_checker
def create_market():
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400
    telegram_data = TelegramInitData(request.cookies.get('initData'))
    user_data = telegram_data.to_dict().get('user')
    try:
        name = request.json.get('name')
        address = request.json.get('address')
        SyncORM.cerate_market(user_data.get('id'), name, address)
    except Exception as e:
        return jsonify({'error': f'{e}'}), 400

    return jsonify({'message': 'Success'}), 201
