import jwt
from flask import abort
from functools import wraps
from flask import request, abort, g

# Настройка секрета для HS256
HS_SECRET = "your_hs_secret_here"


def get_token():
    """Извлечение JWT из заголовка или куки"""
    auth = request.headers.get("Authorization", None)
    if auth and auth.startswith("Bearer "):
        return auth.split(" ", 1)[1]
    return request.cookies.get("auth_token_cookie")


def jwt_valid(fn):
    """Корректная проверка HS256-сигнатуры"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_token()
        if not token:
            abort(401)
        try:
            payload = jwt.decode(token, HS_SECRET, algorithms=["HS256"])
        except jwt.PyJWTError:
            abort(401)
        g.user = payload.get("user")
        return fn(*args, **kwargs)
    return wrapper


def jwt_no_sig(fn):
    """Вектор: alg=none — принимает токен без подписи"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_token()
        print(f"тут: {token}")
        if not token:
            abort(401)
        try:
            header = jwt.get_unverified_header(token)
        except jwt.DecodeError:
            abort(401)
        if header.get("alg") != "none":
            abort(401)
        payload = jwt.decode(token, options={"verify_signature": False})
        g.user = payload.get("user")
        return fn(*args, **kwargs)
    return wrapper


def jwt_ignore_sig(fn):
    """Вектор: полностью игнорируем подпись"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_token()
        print(f"здесь: {token}")
        if not token:
            abort(401)
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
        except jwt.PyJWTError:
            abort(401)
        g.user = payload.get("user")
        return fn(*args, **kwargs)
    return wrapper


def jwt_header_only(fn):
    """Вектор: принимаем только header.payload без подписи"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_token()
        if not token:
            abort(401)
        try:
            header_b64, payload_b64, _ = token.split('.')
            payload_bytes = jwt.api_jws.base64url_decode(payload_b64.encode())
            payload = jwt.json.loads(payload_bytes)
        except Exception:
            abort(401)
        g.user = payload.get("user")
        return fn(*args, **kwargs)
    return wrapper


def jwt_without_token(fn):
    @wraps(fn)
    def wraper(*args, **kwargs):
        token = get_token()
        print(f"{token}")
        if not token:
            abort(401)
        return fn(current_user = 100000001, *args, **kwargs)
    return wraper

