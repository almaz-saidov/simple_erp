from http import HTTPStatus

from flask import json, request, Response

from application import app
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker


@app.get('/api/search')
@init_data_checker
def search_detail():
    """
    Поиск детали по VIN через JSON.
    """
    vin = request.args.get("vin", "")

    if not vin:
        vin = ''

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({
                "success": False,
                "error_message": "Некорректный формат VIN номера."
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    # Получаем детали по VIN
    details = SyncORM.get_detail_by_vin(vin)

    if not details:
        return Response(
            json.dumps({
                "success": False,
                "message": f"Деталь с VIN {vin} не найдена. Количество: 0."
            }),
            status=HTTPStatus.NOT_FOUND,
            mimetype="application/json",
        )

    # Возвращаем успешный ответ с деталями
    return Response(
        json.dumps({
            "success": True,
            "details": details  # Убедитесь, что `details` сериализуем
        }),
        status=HTTPStatus.OK,
        mimetype="application/json",
    )