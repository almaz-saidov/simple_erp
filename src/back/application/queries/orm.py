import re
from datetime import datetime
from typing import Optional

from sqlalchemy import and_, literal, select

from application.database import Base, engine, session_factory # движок, сессии, базовый класс
from application.models import Detail, Purchase, Sell, Return, User, AirReturn


def reformat_vin(vin: str):
    vin = ''.join(char.upper() if char.isalpha() else char for char in vin)
    # A А, B В, C С, E Е, H Н, T Т, O О, K К, P Р, M М
    replaces = {
        'А': 'A',
        'В': 'B',
        'С': 'C',
        'Е': 'E',
        'Н': 'H',
        'Т': 'T',
        'О': 'O',
        'К': 'K',
        'Р': 'P',
        'М': 'M',
        'Х': 'X'
    }
    return ''.join(replaces.get(char, char) for char in vin)

 
class SyncORM:
    @staticmethod
    def create_tables():
        """
        Удаляет существующие таблицы и создаёт их заново.
        """
        engine.echo = False
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        engine.echo = False

    @staticmethod
    def save_changes():
        """
        Сохраняет изменения формы
        """
        # Сохраняем изменения в базе данных
        with session_factory() as session:
            session.commit()

    @staticmethod
    def get_all_users():
        """
        Получить все элементы из таблицы User.
        
        :return: Список объектов.
        """
        with session_factory() as session:
            query = select(User)
            result = session.scalars(query).all()  # scalars() для работы с объектами
            return result
    # ----------------------Detail Methods -------------------

    @staticmethod
    def get_detail_by_vin(vin: str, offset: int = 0, limit: int = 25):
        """Получить детали по VIN"""
        with session_factory() as session:
            vin = reformat_vin(vin)
            query = session.query(Detail)

            if vin == '':
                details = query.offset(offset).limit(limit).all()
            else:
                details = query.filter(Detail.vin.ilike(f'%{vin}%')).offset(offset).limit(limit).all()
            
            # Преобразуем ORM-объекты в словари
            serialized_details = [
                {
                    "vin": detail.vin,
                    "name": detail.name,
                    "amount": detail.amount,
                }
                for detail in details
            ]
            
            return serialized_details

        
    @staticmethod
    def is_valid_vin(vin: str) -> bool:
        """
        Проверяет, является ли VIN номер корректным.
        
        :param vin: VIN номер для проверки
        :return: True, если VIN корректен, иначе False
        """
        if vin == '':
            return True
        # Проверяем, чтобы длина VIN была от 1 до 20 символов
        if not (1 <= len(vin) <= 20):
            return False

        # Проверяем, что VIN содержит только буквы и цифры
        vin_pattern = r"^[A-Za-zА-Яа-я0-9]+$"
        if not re.match(vin_pattern, vin):
            return False

        return True

        
    @staticmethod
    def add_or_update_detail(vin: str, name: str, amount: int):
        """Добавить или обновить количество детали"""
        with session_factory() as session:
            detail = session.query(Detail).filter_by(vin=vin).first()
            if detail:
                detail.amount += amount
            else:
                detail = Detail(vin=vin, name=name, amount=amount)
                session.add(detail)
            session.commit()
            return detail
        
    # ----------------------Purchase Methods -------------------

    @staticmethod
    def add_purchase(vin: str, amount: int, date: datetime, price: int, detail_name: str, who_added: int):
        """
        Добавить приход товара на склад.

        :param vin: VIN детали
        :param price: Цена за единицу
        :param amount: Количество деталей
        :param detail_name: Наименование детали
        :param user_id: ID пользователя, добавившего запись
        :return: Объект добавленной покупки
        """
        with session_factory() as session:
            vin = reformat_vin(vin)
            # Проверяем, существует ли запчасть в Detail
            detail = session.query(Detail).filter_by(vin=vin).first()
            if not detail:
                # Если детали нет, создаем новую запись
                new_detail = Detail(vin=vin, name=detail_name, amount=amount)  # Примерные данные для новой записи в Detail
                session.add(new_detail)
                session.commit()  # Зафиксируем изменения в Detail
            else:
                # Если деталь уже существует, обновляем её количество
                detail.amount += amount
                session.commit()

            # Проверяем, существует ли покупка с таким vin
            purchase = session.query(Purchase).filter_by(vin=vin).first()
            if not purchase:
                # Если покупки с таким VIN нет, создаем новую покупку
                purchase = Purchase(
                    vin=vin,
                    price=price,
                    amount=amount,
                    name=detail_name,
                    add_to_shop_date=date,
                    who_added=who_added
                )
                session.add(purchase)

            session.commit()  # Зафиксируем изменения в Purchase
            return purchase

    #? Пример добавления ID пользователя в сессию:
# Когда пользователь входит в систему, вы, вероятно, добавляете его ID в сессию примерно так:

# python
# Копировать код
# session['user_id'] = user.id  # user.id — это ID пользователя, взятый из вашей базы данных.
# После этого в любом маршруте вы сможете получить ID пользователя, как показано выше.


    @staticmethod
    def get_purchase_history(user_id: int, start_date: Optional[str] = None, end_date: Optional[str] = None):
        """
        Получить историю покупок для пользователя с поддержкой фильтрации по дате.

        :param user_id: ID пользователя для фильтрации
        :param start_date: (Optional) Начальная дата для фильтрации (формат 'YYYY-MM-DD')
        :param end_date: (Optional) Конечная дата для фильтрации (формат 'YYYY-MM-DD')
        :return: Список объектов Purchase
        """
        with session_factory() as session:
            query = session.query(Purchase).join(Detail).join(User).filter(Purchase.who_added == user_id)
            
            # Фильтруем по дате, если даты предоставлены
            if start_date:
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
                query = query.filter(Purchase.add_to_shop_date >= start_date_obj)
            if end_date:
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')
                query = query.filter(Purchase.add_to_shop_date <= end_date_obj)
            
            purchases = query.all()
            return purchases

    @staticmethod
    def get_purchase_by_id(purchase_id: int):
        """Получить поставку по ID"""
        with session_factory() as session:
            purchase = session.query(Purchase).get(purchase_id)
            return purchase


        
    # ----------------------Sell Methods -------------------

    @staticmethod
    def add_sell(vin: str, amount: int, date: datetime, price: int, name: str, who_added: int):
        """
        Выдать (продать) товар со склада.

        :param vin: VIN детали
        :param amount: Количество деталей
        :param date: Дата выдачи
        :param price: Цена за единицу
        :detail_name: Наименование детали
        :param user_id: ID пользователя, добавившего запись
        :return: Объект добавленной покупки
        """
        with session_factory() as session:
            # Проверяем, существует ли запчасть
            vin = reformat_vin(vin)
            detail = session.query(Detail).filter_by(vin=vin).first()
            if not detail:
                raise ValueError(f"Деталь с VIN '{vin}' не найдена.")
            
            if detail.amount < amount:
                raise ValueError(f"Недостаточное количество детали с VIN '{vin}'. Доступно: {detail.amount}, требуется: {amount}.")
            else:
                # Обновляем количество деталей
                detail.amount -= amount

            # Создаем запись о покупке
            sell = Sell(
                vin=vin,
                amount=amount,
                sell_from_shop_date=date,
                price=price,
                seller=name,
                who_added=who_added
            )
            session.add(sell)
            session.commit()
            return sell
    
    @staticmethod
    def get_sell_by_id(sell_id: int):
        """Получить продажу по ID"""
        with session_factory() as session:
            purchase = session.query(Sell).get(sell_id)
            return purchase

    # ----------------------Returns Methods -------------------

    @staticmethod
    def create_return(vin: str, amount: int, sell_date: datetime, return_date: datetime, to_seller: str, price: int, comment: str, is_compleat: bool, who_added: int):
        """
        Оформить возврат товара на склада.
        :param vin: VIN детали
        :param amount: Количество деталей
        :param sell_date: Дата продажи
        :param return_date: Дата возврата
        :param to_seller: Продавец кому вернули товар
        :param price: Цена за единицу
        :param comment: Комментарий к возврату
        :param is_compleat: Условия завершения возврата (завершен или нет)
        :return: Объект добавленной покупки
        """
        with session_factory() as session:
            # Проверяем, существует ли запчасть
            detail = session.query(Detail).filter_by(vin=vin).first()
            if not detail:
                raise ValueError(f"Деталь с VIN '{vin}' не найдена.")
                    
            # Обновляем количество деталей
            # detail.amount += amount

            # Создаем запись о покупке
            returned = Return(
                vin=vin,
                amount=amount,
                sell_date=sell_date,
                return_date=return_date, 
                to_seller=to_seller,
                price=price,
                comment=comment,
                is_end=is_compleat,
                who_added=who_added
            )
            session.add(returned)
            session.commit()
            return SyncORM.to_dict(returned)

    @staticmethod
    def get_return_by_id(return_id: int):
        """Получить возврат по ID"""
        with session_factory() as session:
            purchase = session.query(Return).filter_by(id=return_id).first()
            return purchase



    @staticmethod
    def update_return(return_id: int, vin: str, amount: int, sell_date: datetime, return_date: datetime, to_seller: str, price: int, comment: str, is_compleat: bool, who_added: int):
        """
        Обновить информацию о возврате товара на складе.
        :param return_id: ID возврата, который нужно обновить
        :param vin: VIN детали
        :param amount: Количество деталей
        :param sell_date: Дата продажи
        :param return_date: Дата возврата
        :param to_seller: Продавец кому вернули товар
        :param price: Цена за единицу
        :param comment: Комментарий к возврату
        :param is_compleat: Условия завершения возврата (завершен или нет)
        :return: Обновленный объект возврата
        """
        with session_factory() as session:
            # Получаем возврат по ID
            returned = session.query(Return).filter_by(id=return_id).first()
            if not returned:
                raise ValueError(f"Возврат с ID '{return_id}' не найден.")
            
            # Обновляем данные возврата
            # Обновляем данные возврата
            returned.vin = vin
            returned.amount = amount
            returned.sell_date = sell_date
            returned.return_date = return_date
            returned.to_seller = to_seller
            returned.price = price
            returned.comment = comment
            returned.is_end = is_compleat
            returned.who_added=who_added

            # Сохраняем изменения в базе данных
            session.commit()
            return returned
        

    @staticmethod
    def get_active_ret_items():
        """
        Получить все элементы из таблицы, где is_end == False.
        
        :return: Список объектов, где is_end == False.
        """
        with session_factory() as session:
            query = select(Return).where(Return.is_end == False)
            result = session.scalars(query).all()  # scalars() для работы с объектами
            return result



    # ----------------------AirReturns Methods -------------------

    @staticmethod
    def create_air_return(vin: str, amount: int, sell_date: datetime, return_date: datetime, to_seller: str, price: int, another_shop: str, comment: str, is_compleat: bool, who_added: int):
        """
        Оформить возврат товара на склада.
        :param vin: VIN детали
        :param amount: Количество деталей
        :param sell_date: Дата продажи
        :param return_date: Дата возврата
        :param to_seller: Продавец кому вернули товар
        :param price: Цена за единицу
        :param another_shop: Магазин посредник
        :param comment: Комментарий к возврату
        :param is_compleat: Условия завершения возврата (завершен или нет)
        :return: Объект добавленной покупки
        """
        with session_factory() as session:                    
            # Обновляем количество деталей
            # detail.amount += amount

            # Создаем запись о покупке
            air_returned = AirReturn(
                vin=vin,
                amount=amount,
                sell_date=sell_date,
                return_date=return_date, 
                to_seller=to_seller,
                price=price,
                another_shop=another_shop,
                comment=comment,
                is_end=is_compleat,
                who_added=who_added
            )
            session.add(air_returned)
            session.commit()
            return SyncORM.to_dict(air_returned)
        
    @staticmethod
    def get_airreturn_by_id(airreturn_id: int):
        """Получить возврат-воздуха по ID"""
        with session_factory() as session:
            purchase = session.query(AirReturn).filter_by(id=airreturn_id).first()
            return purchase

        

    @staticmethod
    def update_airreturn(return_id: int, vin: str, amount: int, sell_date: datetime, return_date: datetime, to_seller: str, price: int, another_shop: str, comment: str, is_compleat: bool, who_added: int):
        """
        Обновить информацию о возврате товара на складе.
        :param return_id: ID возврата, который нужно обновить
        :param vin: VIN детали
        :param amount: Количество деталей
        :param sell_date: Дата продажи
        :param return_date: Дата возврата
        :param to_seller: Продавец кому вернули товар
        :param price: Цена за единицу
        :param another_shop: Магазин посредник
        :param comment: Комментарий к возврату
        :param is_compleat: Условия завершения возврата (завершен или нет)
        :return: Обновленный объект возврата
        """
        with session_factory() as session:
            # Получаем возврат по ID
            air_returned = session.query(AirReturn).filter_by(id=return_id).first()
            if not air_returned:
                raise ValueError(f"Возврат-воздух с ID '{return_id}' не найден.")
            
            # Обновляем данные возврата
            air_returned.vin = vin
            air_returned.amount = amount
            air_returned.sell_date = sell_date
            air_returned.return_date = return_date
            air_returned.to_seller = to_seller
            air_returned.price = price
            air_returned.another_shop = another_shop
            air_returned.comment = comment
            air_returned.is_end = is_compleat
            air_returned.who_added=who_added
            # air_returned.who_added=session.get('user_id')
            
            # Сохраняем изменения в базе данных
            session.commit()
            return air_returned

    @staticmethod
    def get_active_airret_items():
        """
        Получить все элементы из таблицы, где is_end == False.
        
        :return: Список объектов, где is_end == False.
        """
        with session_factory() as session:
            query = select(AirReturn).where(AirReturn.is_end == False)
            result = session.scalars(query).all()  # scalars() для работы с объектами
            return result
        


# -------------------------- History -------------------------

    
    @staticmethod
    def get_records(record_type: str, vin_filter: str, date_from: str, date_before: str):
        """
        Получить записи в зависимости от типа с применением фильтров.
        """
        # Преобразуем даты в объекты datetime
        date_from = datetime.strptime(date_from, '%Y-%m-%d') if date_from else None
        date_before = datetime.strptime(date_before, '%Y-%m-%d') if date_before else None

        # Открываем сессию внутри метода
        with session_factory() as session:
            # Инициализируем запрос в зависимости от типа
            if record_type == 'vozvraty':
            # Для типа vozvraty объединяем таблицы Return и AirReturn
                return_query = session.query(
                    Return.id,
                    Return.vin,
                    Return.amount,
                    Return.sell_date,
                    Return.return_date,
                    Return.to_seller,
                    Return.price,
                    Return.comment,
                    Return.is_end,
                    literal('return').label('type')  # Указываем тип записи
                ).where(Return.is_end == True)

                air_return_query = session.query(
                    AirReturn.id,
                    AirReturn.vin,
                    AirReturn.amount,
                    AirReturn.sell_date,
                    AirReturn.return_date,
                    AirReturn.to_seller,
                    AirReturn.price,
                    AirReturn.comment,
                    AirReturn.is_end,
                    literal('airreturn').label('type')  # Указываем тип записи
                ).where(AirReturn.is_end == True)

                # Применяем фильтры, если они заданы
                if vin_filter:
                    return_query = return_query.filter(Return.vin.ilike(f"%{vin_filter}%"))
                    air_return_query = air_return_query.filter(AirReturn.vin.ilike(f"%{vin_filter}%"))
                if date_from:
                    return_query = return_query.filter(Return.return_date >= date_from)
                    air_return_query = air_return_query.filter(AirReturn.return_date >= date_from)
                if date_before:
                    return_query = return_query.filter(Return.return_date <= date_before)
                    air_return_query = air_return_query.filter(AirReturn.return_date <= date_before)

                # Объединяем запросы через union
                combined_query = return_query.union(air_return_query)

                # Получаем результаты
                records = combined_query.all()
            

            elif record_type == 'postupleniya':
                query = session.query(
                    Purchase.id,
                    Purchase.vin,
                    Purchase.amount,
                    Purchase.add_to_shop_date.label('date'),
                    Purchase.price,
                    literal('postupleniya').label('type')  # Указываем тип записи
                )
                filters = []
                if vin_filter:
                    filters.append(Purchase.vin.ilike(f"%{vin_filter}%"))
                if date_from:
                    filters.append(Purchase.add_to_shop_date >= date_from)
                if date_before:
                    filters.append(Purchase.add_to_shop_date <= date_before)
                records = query.filter(and_(*filters)).all()
                
            elif record_type == 'vidyacha':
                query = session.query(
                    Sell.id,
                    Sell.vin,
                    Sell.amount,
                    Sell.sell_from_shop_date.label('date'),
                    Sell.price,
                    literal('vidyacha').label('type')  # Указываем тип записи
                )
                filters = []
                if vin_filter:
                    filters.append(Sell.vin.ilike(f"%{vin_filter}%"))
                if date_from:
                    filters.append(Sell.sell_from_shop_date >= date_from)
                if date_before:
                    filters.append(Sell.sell_from_shop_date <= date_before)
                records = query.filter(and_(*filters)).all()
            else:
                raise ValueError("Invalid type parameter")


        # Если тип не 'vozvraty', фильтруем по стандартному запросу
        result = [
            {
                "id": record.id,
                "vin": record.vin,
                "date": (
                    getattr(record, 'return_date', 
                            getattr(record, 'purchase_date', 
                                    getattr(record, 'sell_date', None)))
                    if isinstance(getattr(record, 'return_date', None), datetime)
                    else (
                        datetime.strptime(getattr(record, 'return_date', ''), '%Y-%m-%d') 
                        if isinstance(getattr(record, 'return_date', None), str)
                        else ''
                    )
                ).strftime('%Y-%m-%d') if isinstance(getattr(record, 'return_date', None), datetime) else '',
                "amount": record.amount,
                "price": record.price,
                "type":  record.type,  # Используем заранее добавленный тип
            }
            for record in records
        ]

        return result


    

# ------------------------API---------------------------
    @staticmethod
    def to_dict(obj):
        """
        Преобразует объект SQLAlchemy в словарь для сериализации в JSON.
        :param obj: Объект модели SQLAlchemy.
        :return: Словарь с атрибутами объекта.
        """
        if obj is None:
            return {}

        return {
            column.name: getattr(obj, column.name)
            for column in obj.__table__.columns
        }

