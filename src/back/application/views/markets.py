from http import HTTPStatus
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

# from application import app
from application.queries.orm import SyncORM
from application.utils import init_data_checker
from application.utils.init_data import TelegramInitData
from . import bp


@bp.get('/api/markets')
@jwt_required()
def markets():

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    user_data = request.cookies.get('user')
    user_id = user_data.get('id')

    user_status = SyncORM.get_user_status(user_id)
    # print(user_status)
    if user_status == 'admin' or user_status == 'seller':
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
@jwt_required()
def create_market():

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    if not request.is_json:
        print("LOX1")
        return jsonify({'error': 'Request body must be JSON'}), 400
    user_data = request.cookies.get('user')
    try:
        name = request.json.get('name')
        address = request.json.get('address')
        print(f"{name}-{address}-{user_data.get('id')}")
        SyncORM.cerate_market(user_data.get('id'), name, address)
    except Exception as e:
        print("LOX2")
        return jsonify({'error': f'{e}'}), 400

    return jsonify({'message': 'Success'}), 201
