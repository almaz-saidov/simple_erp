from flask import jsonify, request
from flask_jwt_extended import create_access_token

# from application import app
from application.queries.orm import SyncORM
from . import bp


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = SyncORM.get_user_by_username(username)  # Ищем пользователя
    if not user or not user.check_password(password):  # Проверяем пароль
        return jsonify({"error": "Неверный логин или пароль"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200
