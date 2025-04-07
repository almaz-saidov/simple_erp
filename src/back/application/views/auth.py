from flask import jsonify, make_response, request
from flask_jwt_extended import create_access_token, set_access_cookies,jwt_required, get_jwt_identity, unset_jwt_cookies

from datetime import timedelta
# from application import app
from application.queries.orm import SyncORM
from . import bp
from config.config import settings

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("login")
    password = data.get("password")
    print(f"username: {username}, {password}")

    user = SyncORM.get_user_by_username(username)  # Ищем пользователя
    print(f"user: {user}")
    if not user or not user.check_password(password):  # Проверяем пароль
        return jsonify({"error": "Неверный логин или пароль"}), 401

    # Создаем токен с установкой срока действия
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=1)

    )

    # Создаем ответ
    response = make_response(jsonify({
        "message": "Успешная авторизация",
        "user_id": user.id,
        "username": user.username
    }), 200)
    
    # Устанавливаем токен в HTTP-Only куку
    set_access_cookies(response, access_token)
    
    return response

@bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Успешный выход"}), 200)
    # Удаляем JWT куки
    unset_jwt_cookies(response)
    return response
    
     