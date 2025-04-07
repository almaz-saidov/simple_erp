from http import HTTPStatus

from flask import Response, json, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

# from application import app
from application.forms import ReturnForm, AirReturnForm
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker
from application.utils.init_data import TelegramInitData
from . import bp


@bp.get('/api/returns')
@jwt_required()
def returns():

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    market_id = request.args.get('market_id', type=int)
    air_ret = SyncORM.get_active_airret_items(market_id)
    default_ret = SyncORM.get_active_ret_items(market_id)

    return_list = []
    for ret in air_ret:
        return_list.append({
            "id": ret.id,
            "vin": ret.vin,
            "return_date": ret.return_date,
            "type": "airreturn"  # Добавляем тип для воздушных возвратов
        })

    for ret in default_ret:
        return_list.append({
            "id": ret.id,
            "vin": ret.detail.vin,
            "return_date": ret.return_date,
            "type": "return"  # Добавляем тип для обычных возвратов
        })
    
    # Сортируем объединенный список по дате возврата
    sorted_return_list = sorted(return_list, key=lambda x: x["return_date"])

    # Теперь sorted_return_list содержит данные, отсортированные по возрастанию даты
    response_data = json.dumps({
        "success": True,
        "sorted_return_list": sorted_return_list,
    })
    
    return Response(
        response_data,
        status=HTTPStatus.OK,
        mimetype='application/json'
    )


@bp.post('/api/returns/create_return')
@jwt_required()
def create_return():
    """
    Ручка для создания возврата через JSON.
    """

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    # Получаем данные из JSON-запроса
    data = request.get_json()

    if not data:
        return Response(
            json.dumps({"error": "Пустой запрос или неверный формат JSON."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    
    form = ReturnForm(data=data)
    if not form.validate():
        return Response(
            json.dumps({
                "success": False,
                "errors": form.errors
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    # Извлекаем данные из запроса
    vin = data['vin']
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({
                "success": False,
                "error_message": "Incorrect VIN."
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    amount = data['amount']
    sell_date = data['sell_date']
    return_date = data['return_date']
    to_seller = data['to_seller']
    price = data['price']
    comment = data['comment']
    is_compleat = data['is_compleat']
    who_added = user.id
    # who_added = 1
    market_id = request.args.get('market_id', type=int)

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({"success": False, "message": "Некорректный VIN номер."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

    try:
        # Создаем возврат через SyncORM
        purchase = SyncORM.create_return(vin, amount, sell_date, return_date, to_seller, price, comment, is_compleat, who_added, market_id)
        
        return Response(
            json.dumps({
                "success": True,
                "message": f"Возврат VIN {vin} успешно возвращен!",
                "purchase": purchase  #! .to_dict() Предположим, что purchase можно сериализовать
            }),
            status=HTTPStatus.CREATED,
            mimetype="application/json"
        )
    except ValueError as e:
        return Response(
            json.dumps({"success": False, "message": f"Ошибка: {str(e)}"}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )


@bp.route('/api/returns/create_air_return', methods=["POST"])
@jwt_required()
def create_air_return():
    """
    Ручка для создания возврата через JSON.
    """

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    # Получаем данные из JSON-запроса
    data = request.get_json()

    # # Проверяем наличие всех обязательных параметров
    # required_fields = ['vin', 'amount', 'sell_date', 'return_date', 'to_seller', 'price', 'another_shop', 'comment', 'is_compleat']
    # missing_fields = [field for field in required_fields if field not in data]

    # if missing_fields:
    #     return Response(
    #         json.dumps({"success": False, "message": f"Отсутствуют обязательные параметры: {', '.join(missing_fields)}"}),
    #         status=HTTPStatus.BAD_REQUEST,
    #         mimetype="application/json"
    #     )

    if not data:
        return Response(
            json.dumps({"error": "Пустой запрос или неверный формат JSON."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    
    form = AirReturnForm(data=data)
    if not form.validate():
        return Response(
            json.dumps({
                "success": False,
                "errors": form.errors
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    # Извлекаем данные из запроса
    vin = data['vin']
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({
                "success": False,
                "error_message": "Incorrect VIN."
            }),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )
    amount = data['amount']
    sell_date = data['sell_date']
    return_date = data['return_date']
    to_seller = data['to_seller']
    price = data['price']
    another_shop = data['another_shop']
    comment = data['comment']
    is_compleat = data['is_compleat']
    who_added = user.id
    # who_added = 1
    market_id = request.args.get('market_id', type=int)

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({"success": False, "message": "Некорректный VIN номер."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

    try:
        # Создаем возврат через SyncORM
        purchase = SyncORM.create_air_return(vin, amount, sell_date, return_date, to_seller, price, another_shop, comment, is_compleat, who_added, market_id)
        
        return Response(
            json.dumps({
                "success": True,
                "message": f"Возврат VIN {vin} успешно возвращен!",
                "purchase": purchase   #! .to_dict() Предположим, что purchase можно сериализовать
            }),
            status=HTTPStatus.CREATED,
            mimetype="application/json"
        )
    except ValueError as e:
        return Response(
            json.dumps({"success": False, "message": f"Ошибка: {str(e)}"}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

@bp.route('/api/returns/<int:return_id>', methods=["GET", "POST", "DELETE"])
@jwt_required()
def check_return(return_id):

    current_user_id = get_jwt_identity()
    # Получаем объект пользователя из БД
    user = SyncORM.get_user_by_id(current_user_id)
    if not user:
        return jsonify({
            "success": False,
            "error_message": "User not found"
        }), HTTPStatus.UNAUTHORIZED
    
    return_type = request.args.get("type")  # Получаем параметр типа возврата из URL
    market_id = request.args.get('market_id', type=int)
    returned = None

    # В зависимости от типа возврата выбираем нужную модель
    if return_type == "return":
        returned = SyncORM.get_return_by_id(return_id, market_id)  # Модель для возврата
    elif return_type == "airreturn":
        returned = SyncORM.get_airreturn_by_id(return_id, market_id)  # Модель для AirReturn
    else:
        return Response(
            json.dumps({"success": False, "message": "Неизвестный тип возврата"}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    if returned:
        # Заполняем данные для отправки        
        response_data = {
            "amount": returned.amount,
            "sell_date": returned.sell_date,
            "return_date": returned.return_date,
            "price": returned.price,
            "to_seller": returned.to_seller,
            "comment": returned.comment,
            "is_compleat": returned.is_end,
        }

        # Если это AirReturn, то добавляем поле для другого магазина
        if return_type == "airreturn":
            response_data["another_shop"] = returned.another_shop
            response_data["vin"] = returned.vin

        if return_type == "return":
            response_data["vin"] = returned.detail.vin

        if request.method == "DELETE":
            try:
                SyncORM.delete_return(return_id, return_type)
            except Exception as e:
                return Response(
                    json.dumps({"success": False, "message": "Неизвестный тип возврата", "return": e}),
                    status=HTTPStatus.BAD_REQUEST,
                    mimetype="application/json",
                )
            
        # Обрабатываем POST-запрос (обновление данных)
        if request.method == "POST":
            data = request.get_json()

            if not data:
                return Response(
                    json.dumps({"error": "Пустой запрос или неверный формат JSON."}),
                    status=HTTPStatus.BAD_REQUEST,
                    mimetype="application/json",
                )
            
            if return_type == 'return':
                form = ReturnForm(data=data)
            else:
                form = AirReturnForm(data=data)

            if not form.validate():
                return Response(
                    json.dumps({
                        "success": False,
                        "errors": form.errors
                    }),
                    status=HTTPStatus.BAD_REQUEST,
                    mimetype="application/json",
                )

            # Обновляем данные из полученного JSON
            vin_from_data = data.get("vin")
            if not SyncORM.is_valid_vin(vin_from_data):
                return Response(
                    json.dumps({
                        "success": False,
                        "error_message": "Incorrect VIN."
                    }),
                    status=HTTPStatus.BAD_REQUEST,
                    mimetype="application/json",
                )
            returned.amount = data.get("amount", returned.amount)
            returned.sell_date = data.get("sell_date", returned.sell_date)
            returned.return_date = data.get("return_date", returned.return_date)
            returned.to_seller = data.get("to_seller", returned.to_seller)
            returned.price = data.get("price", returned.price)
            returned.comment = data.get("comment", returned.comment)
            returned.is_end = data.get("is_compleat", returned.is_end)
            returned.who_added = user.id
            # returned.who_added = 56123

            # Для AirReturn добавляем обработку поля другого магазина
            if return_type == "airreturn":
                returned.another_shop = data.get("another_shop", returned.another_shop)

            # Сохраняем обновленные данные
            if return_type == "airreturn":
                SyncORM.update_airreturn(return_id, vin_from_data, returned.amount, returned.sell_date, returned.return_date, returned.to_seller, returned.price, returned.another_shop, returned.comment, returned.is_end, returned.who_added)
            else:
                SyncORM.update_return(return_id, vin_from_data, returned.amount, returned.sell_date, returned.return_date, returned.to_seller, returned.price, returned.comment, returned.is_end, returned.who_added)

            return Response(
                json.dumps({
                    "success": True,
                    "message": "Данные возврата успешно обновлены",
                    "return": response_data
                }),
                status=HTTPStatus.OK,
                mimetype="application/json",
            )

        # Если это GET-запрос, возвращаем данные возврата
        return Response(
            json.dumps({
                "success": True,
                "message": "Данные для возврата",
                "return": response_data
            }),
            status=HTTPStatus.OK,
            mimetype="application/json",
        )

    return Response(
        json.dumps({"success": False, "message": "Возврат не найден"}),
        status=HTTPStatus.NOT_FOUND,
        mimetype="application/json",
    )
