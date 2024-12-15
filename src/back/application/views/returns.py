from http import HTTPStatus
from flask import Response, json, request
from application import app
from application.forms import ReturnForm, AirReturnForm
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker
from application.utils.init_data import TelegramInitData


@app.get('/api/returns')
@init_data_checker
def returns():
    air_ret = SyncORM.get_active_airret_items()
    default_ret = SyncORM.get_active_ret_items()

    return_list = []
    for ret in air_ret:
        return_list.append({
            "id": ret.id,
            "vin": ret.vin,
            "return_date": ret.return_date.isoformat(),
            "type": "airreturn"  # Добавляем тип для воздушных возвратов
        })

    for ret in default_ret:
        return_list.append({
            "id": ret.id,
            "vin": ret.vin,
            "return_date": ret.return_date.isoformat(),
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


@app.post('/api/returns/create_return')
@init_data_checker
def create_return():
    """
    Ручка для создания возврата через JSON.
    """

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
    telegram_data = TelegramInitData(request.form.get('initData'))
    user_data = telegram_data.to_dict().get('user')
    who_added = user_data.get('id')

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({"success": False, "message": "Некорректный VIN номер."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

    try:
        # Создаем возврат через SyncORM
        purchase = SyncORM.create_return(vin, amount, sell_date, return_date, to_seller, price, comment, is_compleat, who_added)
        
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



@app.route('/api/returns/create_air_return', methods=["POST"])
def create_air_return():
    """
    Ручка для создания возврата через JSON.
    """

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
    # who_added = 

    # Проверяем корректность VIN
    if not SyncORM.is_valid_vin(vin):
        return Response(
            json.dumps({"success": False, "message": "Некорректный VIN номер."}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

    try:
        # Создаем возврат через SyncORM
        purchase = SyncORM.create_air_return(vin, amount, sell_date, return_date, to_seller, price, another_shop, comment, is_compleat, who_added)
        
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


@app.route('/api/returns/<int:return_id>', methods=["GET", "POST"])
def check_return(return_id):
    return_type = request.args.get("type")  # Получаем параметр типа возврата из URL
    
    returned = None

    # В зависимости от типа возврата выбираем нужную модель
    if return_type == "return":
        returned = SyncORM.get_return_by_id(return_id)  # Модель для возврата
    elif return_type == "airreturn":
        returned = SyncORM.get_airreturn_by_id(return_id)  # Модель для AirReturn
    else:
        return Response(
            json.dumps({"success": False, "message": "Неизвестный тип возврата"}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json",
        )

    if returned:
        # Заполняем данные для отправки
        response_data = {
            "vin": returned.vin,
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
            returned.vin = data.get("vin", returned.vin)
            if not SyncORM.is_valid_vin(returned.vin):
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
            # returned.who_added = 

            # Для AirReturn добавляем обработку поля другого магазина
            if return_type == "airreturn":
                returned.another_shop = data.get("another_shop", returned.another_shop)

            # Сохраняем обновленные данные
            if return_type == "airreturn":
                SyncORM.update_airreturn(return_id, returned.vin, returned.amount, returned.sell_date, returned.return_date, returned.to_seller, returned.price, returned.another_shop, returned.comment, returned.is_end, returned.who_added)
            else:
                SyncORM.update_return(return_id, returned.vin, returned.amount, returned.sell_date, returned.return_date, returned.to_seller, returned.price, returned.comment, returned.is_end, returned.who_added)

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

