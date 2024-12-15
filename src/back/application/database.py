from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from config.config import settings


#! Создаем движок для db
engine = create_engine(
	url=settings.DATABASE_URL_psycopg,
	echo=False, # Все запросы будут показываться в cmd
	# pool_size=5, # Размер количества соединений
	# max_overflow=10, # Доп. количество соединений
)

session_factory = sessionmaker(engine)

class Base(DeclarativeBase):
	pass