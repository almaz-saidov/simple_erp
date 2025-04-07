from http import HTTPStatus

from flask import Response, json, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

# from application import app
from application.forms import PurchaseForm
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker
from application.utils.init_data import TelegramInitData
from . import bp


@bp.post('/api/purchases')
@jwt_required()
def purchases():
    """
    Ручка для добавления новой покупки через JSON.
    """

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    # Получаем данные из JSON запроса
    data = request.get_json()

    if not data:
        return Response(
            json.dumps({"error": "Пустой запрос или неверный формат JSON."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    form = PurchaseForm(data=data)

    if not form.validate():
        return Response(
            json.dumps({
                "success": False,
                "errors": form.errors
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    # Извлекаем данные из формы
    vin = data["vin"]
    amount = data["amount"]
    date = data["date"]
    price = data["price"]
    detail_name = data["detail_name"]
    who_added = user.id
    # who_added = 1
    market_id = request.args.get('market_id', type=int)

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({
                "success": False,
                "error_message": "Некорректный VIN номер."
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    # Пытаемся добавить покупку
    try:
        purchase = SyncORM.add_purchase(vin, amount, date, price, detail_name, who_added, market_id)
        return Response(
            json.dumps({
                "success": True,
                "message": f"Покупка VIN {vin} успешно добавлена!",
                }),
            status=HTTPStatus.CREATED,
            mimetype="application/json",
        )
    except ValueError as e:
        return Response(
            json.dumps({
                "success": False,
                "error_message": f"Ошибка: {str(e)}"
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
