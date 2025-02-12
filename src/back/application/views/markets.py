from flask import jsonify, request

# from application import app
from application.queries.orm import SyncORM
from application.utils import init_data_checker
from application.utils.init_data import TelegramInitData
from . import bp


@bp.get('/api/markets')
@init_data_checker
def markets():
    telegram_data = TelegramInitData(request.cookies.get('initData'))
    user_data = telegram_data.to_dict().get('user')
    user_id = user_data.get('id')

    user_status = SyncORM.get_user_status(user_id)
    print(user_status)

    if user_status == 'admin':
        markets = SyncORM.get_all_markets()
        return jsonify({'records': [{'id': market.id, 'name': market.name, 'address': market.address} for market in markets]}), 200
    elif user_status == 'worker':
        market = SyncORM.get_market(user_id)
        return jsonify({'records': [{'id': market.id, 'name': market.name, 'address': market.address}]})
    # markets_list = [
    #     {
    #         'id': market.id,
    #         'name': market.name,
    #         'address': market.address
    #     }
    #     for market in markets
    # ]

    return jsonify({'markets': 'None'}), 404


@bp.post('/api/markets')
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
