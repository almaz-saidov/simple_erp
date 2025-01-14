from http import HTTPStatus

from flask import Response, json, request

from application import app
from application.forms import AirReturnForm, ReturnForm, SalesForm, PurchaseForm
from application.queries.orm import SyncORM
from application.utils.checker import init_data_checker
from application.utils.init_data import TelegramInitData


@app.get('/api/history')
@init_data_checker
def history():
    """
    Получение записей истории в формате JSON с использованием Response.
    """
    # Получаем параметры из запроса
    record_type = request.args.get('type', default='vozvraty', type=str)
    vin_filter = request.args.get('like', default='', type=str)
    date_from = request.args.get('date_from', type=str)
    date_before = request.args.get('date_before', type=str)
    market_id = int(request.args.get('market_id'))

    try:
        # Получаем записи по заданным параметрам
        records = SyncORM.get_records(record_type, vin_filter, date_from, date_before, market_id)
    except ValueError:
        return Response(
            json.dumps({"success": False, "error_message": "Invalid type parameter"}),
            status=HTTPStatus.BAD_REQUEST,
            mimetype="application/json"
        )

    # Формируем JSON-ответ вручную
    response_data = {
        "success": True,
        "filters": {
            "type": record_type,
            "vin_filter": vin_filter,
            "date_from": date_from,
            "date_before": date_before, 
            "market_id": market_id,
        },
        "records": records  # Должен быть сериализуемым в JSON
    }

    return Response(
        json.dumps(response_data, ensure_ascii=False),
        status=HTTPStatus.OK,
        mimetype="application/json"
    )


@app.route("/api/history/sell/<int:sell_id>", methods=["GET", "POST"])
@init_data_checker
def history_sell(sell_id):
    if request.method == "POST":
        # Получаем данные из JSON запроса
        data = request.get_json()
        if not data:
            return Response(
                json.dumps({
                    "success": False,
                    "message": "Некорректный формат данных. Ожидается JSON."
                }),
                status=HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
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
    else:
        # Для GET запроса создаем пустой объект данных
        data = {}
    # Находим продажу по ID в базе данных
    sell = SyncORM.get_sell_by_id(sell_id)

    if not sell:
        return Response(
            json.dumps({
                "success": False,
                "message": f"Продажа с ID {sell_id} не найдена!"
            }),
            status=HTTPStatus.NOT_FOUND,
            mimetype="application/json",
        )

    # Если пришли данные на обновление или это GET запрос, заполняем их из базы
    data["vin"] = sell.vin
    data["amount"] = sell.amount
    data["date"] = sell.sell_from_shop_date
    data["price"] = sell.price
    data["name"] = sell.seller
    data["who_added"] = sell.user_who_added.name

    # Отправляем обновленные данные обратно на фронт
    return Response(
        json.dumps({
            "success": True,
            "message": f"Данные для продажи VIN {sell.vin} успешно обновлены!",
            "sell": data  # Отправляем обновленные данные
        }),
        status=HTTPStatus.OK,
        mimetype="application/json",
    )


@app.route("/api/history/purchase/<int:purchase_id>", methods=["GET", "POST"])
@init_data_checker
def history_purchase(purchase_id):
    if request.method == "POST":
        # Получаем данные из JSON запроса
        data = request.get_json()

        if not data:
            return Response(
                json.dumps({
                    "success": False,
                    "message": "Некорректный формат данных. Ожидается JSON."
                }),
                status=HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
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
    else:
        # Для GET запроса создаем пустой объект данных
        data = {}

    # В зависимости от типа возврата выбираем нужную форму
    purchase = SyncORM.get_purchase_by_id(purchase_id)  # Модель для возврата
     
    if not purchase:
        return Response(
            json.dumps({
                "success": False,
                "message": f"Продажа с ID {purchase_id} не найдена!"
            }),
            status=HTTPStatus.NOT_FOUND,
            mimetype="application/json",
        )

    data["vin"] = purchase.detail.vin
    data["amount"] = purchase.amount
    data["date"] = purchase.add_to_shop_date
    data["price"] = purchase.price
    data["detail_name"] = purchase.name
    data["who_added"] = purchase.user_who_added.name
        
    # Отправляем обновленные данные обратно на фронт
    return Response(
        json.dumps({
            "success": True,
            "message": f"Данные для продажи VIN {purchase.vin} успешно обновлены!",
            "purchase": data  # Отправляем обновленные данные
        }),
        status=HTTPStatus.OK,
        mimetype="application/json",
    )


@app.route("/api/history/returns/<int:return_id>", methods=["GET", "POST"])
@init_data_checker
def history_return(return_id):
    return_type = request.args.get("type")  # Получаем параметр типа возврата из URL или формы
    returned = None

    # В зависимости от типа возврата выбираем нужную форму
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
        # Получаем данные из базы и заполняем ответ для клиента
        response_data = {
            "vin": returned.vin,
            "amount": returned.amount,
            "sell_date": returned.sell_date,
            "return_date": returned.return_date,
            "price": returned.price,
            "to_seller": returned.to_seller,
            "comment": returned.comment,
            "is_compleat": returned.is_end,
            "who_added": returned.user_who_added.name,
        }
        
        # Если это AirReturn, то добавляем поле для другого магазина
        if return_type == "airreturn":
            response_data["another_shop"] = returned.another_shop

        # Если это POST-запрос, обновляем данные
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

            # Обновляем данные из полученного JSON
            returned.amount = data.get("amount", returned.amount)
            returned.sell_date = data.get("sell_date", returned.sell_date)
            returned.return_date = data.get("return_date", returned.return_date)
            returned.to_seller = data.get("to_seller", returned.to_seller)
            returned.price = data.get("price", returned.price)
            returned.comment = data.get("comment", returned.comment)
            returned.is_end = data.get("is_compleat", returned.is_end)
            telegram_data = TelegramInitData(request.cookies.get('initData'))
            user_data = telegram_data.to_dict().get('user')
            returned.who_added = user_data.get('id')

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