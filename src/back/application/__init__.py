import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from config.config import settings
from application.views import bp

#! Создание приложения
app = Flask(__name__)

app.register_blueprint(bp)

CORS(app, resources={r'/api/*': {'origins': ['https://asm3ceps.ru']}})

# Add Database
app.config['SQLALCHEMY_DATABASE_URI'] = settings.DATABASE_URL_psycopg

app.config['SECRET_KEY'] = settings.SECRET_KEY

app.config['WTF_CSRF_ENABLED'] = False

app.config['TELEGRAM_BOT_TOKEN'] = settings.TELEGRAM_BOT_TOKEN

app.config.update(
    SESSION_COOKIE_SECURE=True,       # Кука доступна только по HTTPS
    SESSION_COOKIE_HTTPONLY=True,     # Кука недоступна для JavaScript
    SESSION_COOKIE_SAMESITE='None',   # Политика SameSite для кук
)

app.permanent_session_lifetime = timedelta(minutes=20)

db = SQLAlchemy(app)

from application import models
from application import views
from application import forms
from application import database
from application import queries
from application import utils
