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
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 25, type=int)

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

     # Определяем offset для пагинации
    offset = (page - 1) * per_page

    # Получаем детали по VIN с учетом пагинации
    details = SyncORM.get_detail_by_vin(vin, offset=offset, limit=per_page)

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
            "details": details,  # Убедитесь, что `details` сериализуем
            "page": page,
            "per_page": per_page
        }),
        status=HTTPStatus.OK,
        mimetype="application/json",
    )