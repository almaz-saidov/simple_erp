from http import HTTPStatus

from flask import Response, json, request

# from application import app
from application.forms import SalesForm
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker
from application.utils.details_notifications import send_notification
from application.utils.init_data import TelegramInitData
from . import bp


@bp.post('/api/sales')
@init_data_checker
def sales():
    """
    Ручка для добавления новой продажи через JSON.
    """
    # Получаем данные из JSON запроса
    data = request.get_json()

    if not data:
        return Response(
            json.dumps({"error": "Пустой запрос или неверный формат JSON."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    form = SalesForm(data=data)

    if not form.validate():
        return Response(
            json.dumps({
                "success": False,
                "errors": form.errors
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    vin = data['vin']
    amount = data['amount']
    date = data['date']
    price = data['price']
    name = data['name']
    telegram_data = TelegramInitData(request.cookies.get('initData'))
    user_data = telegram_data.to_dict().get('user')
    who_added = user_data.get('id')
    # who_added = 1
    market_id = request.args.get('market_id', type=int)

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({
                "success": False,
                "error_message": "Incorrect VIN."
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    # Пытаемся добавить продажу
    try:
        residue = SyncORM.add_sell(vin, amount, date, price, name, who_added, market_id)
        
        if residue == 0:
            market = SyncORM.get_market(market_id)

            admins_id = SyncORM.get_admins_id()
            for admin_id in admins_id:
                send_notification(message_text=f"На складе закончилась деталь:\n{name}, VIN: {vin}, магазин: {market.name}", id=admin_id)

            # workers_id = SyncORM.get_workers_id()
            # for worker_id in workers_id:
            #     send_notification(message_text=f"На складе закончилась деталь:\n{name}, VIN: {vin}", id=worker_id)
        
        return Response(
            json.dumps({
                "success": True,
                "message": f"Add sale with VIN {vin}."
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
