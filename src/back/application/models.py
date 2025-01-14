import datetime
import enum
from typing import Annotated, Optional

from sqlalchemy import Date, String, Integer, ForeignKey, Enum, Boolean, func, text, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from application.database import Base

intpk = Annotated[int, mapped_column(primary_key=True)]


class StatusObject(enum.Enum):
	worker = "worker"
	admin = "admin"
	seller = "seller" # avito future


class Market(Base):
    __tablename__ = "Market"
    id: Mapped[intpk]
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    address: Mapped[str] = mapped_column(String, unique=True)


class User(Base):
    """Пользователи с tg"""
    __tablename__ = "User"
    id: Mapped[BigInteger] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    surname: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[StatusObject] = mapped_column(Enum(StatusObject), default=StatusObject.worker)


class MarketUserMapper(Base):
    __tablename__ = "MarketUserMapper"
    id: Mapped[intpk]
    user_id: Mapped[BigInteger] = mapped_column(BigInteger, ForeignKey('User.id'), nullable=False)
    market_id: Mapped[Integer] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)
    user = relationship('User', backref='MarketUserMapper', lazy='joined')
    market = relationship('Market', backref='MarketUserMapper', lazy='joined')


class Detail(Base):
    __tablename__ = "Detail"
    id: Mapped[intpk]
    vin: Mapped[str] = mapped_column(String(25), unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)
    market = relationship("Market", backref="detail", lazy="joined", uselist=False)


class Purchase(Base):
    """Добавление на склад (покупка)"""
    __tablename__ = "Purchase"
    id: Mapped[intpk]
    detail_id: Mapped[int] = mapped_column(Integer, ForeignKey("Detail.id"), nullable=False)
    detail = relationship("Detail", backref="purchase", lazy="joined")
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    add_to_shop_date: Mapped[datetime.date] = mapped_column(Date,server_default=text("TIMEZONE('utc', now())"))
    # seller: Mapped[str] = mapped_column(String, nullable=False) 
    who_added: Mapped[BigInteger] = mapped_column(BigInteger, ForeignKey("User.id"), nullable=False)
    # supplier: Mapped[str] = mapped_column(String, nullable=True) # ? на будущее поставщик кто поставил запчасть
    user_who_added = relationship("User", backref="purchase", lazy="joined", uselist=False) # !  автоматически создаем обратное отношение в другой таблице без явного указания relationship там.
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)
    market = relationship("Market", backref="purchase", lazy="joined", uselist=False)


class Sell(Base):
    """Выдача со склада (продажа)"""
    __tablename__="Sell"
    id: Mapped[intpk]
    # vin: Mapped[str] = mapped_column(String(25), ForeignKey("Detail.vin"), nullable=False)
    detail_id: Mapped[int] = mapped_column(Integer, ForeignKey("Detail.id"), nullable=False)
    detail = relationship("Detail", backref="sell", lazy="joined")
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    sell_from_shop_date: Mapped[datetime.date] = mapped_column(Date,server_default=text("TIMEZONE('utc', now())"))
    seller: Mapped[str] = mapped_column(String, nullable=False) # ? какой продавец на авито продал деталь (получил заказ)
    who_added: Mapped[BigInteger] = mapped_column(BigInteger, ForeignKey("User.id"), nullable=False)
    # client: Mapped[str] = mapped_column(String, nullable=True) # ? на будущее кому продали
    user_who_added = relationship("User", backref="sell", lazy="joined", uselist=False) # !  автоматически создаем обратное отношение в другой таблице без явного указания relationship там.
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)


class Return(Base):
    """Возвраты в Магазин"""
    __tablename__ = "Return"
    id: Mapped[intpk]
    # vin: Mapped[str] = mapped_column(String(25), nullable=False)
    detail_id: Mapped[int] = mapped_column(Integer, ForeignKey("Detail.id"), nullable=False)
    detail = relationship("Detail", backref="return", lazy="joined")
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # from_client: Mapped[str | None]
    sell_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    return_date: Mapped[datetime.date] = mapped_column(Date, server_default=text("TIMEZONE('utc', now())"))
    to_seller: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(String(2000), nullable=True)
    is_end: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    who_added: Mapped[BigInteger] = mapped_column(BigInteger, ForeignKey("User.id"), nullable=False)
    # another_shop: Mapped[str | None] = mapped_column(String, nullable=True)
    user_who_added = relationship("User", backref="return", lazy="joined", uselist=False) # !  автоматически создаем обратное отношение в другой таблице без явного указания relationship там.
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)


class AirReturn(Base):
    """Возвраты в Магазин"""
    __tablename__ = "AirReturn"
    # сделать поле с пометкой осуществлен ли возврат  
    id: Mapped[intpk]
    # vin: Mapped[str] = mapped_column(String(25), nullable=False)
    detail_id: Mapped[int] = mapped_column(Integer, ForeignKey("Detail.id"), nullable=False)
    detail = relationship("Detail", backref="airreturn", lazy="joined")
    amount: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # from_client: Mapped[str | None]
    sell_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    return_date: Mapped[datetime.date] = mapped_column(Date,server_default=text("TIMEZONE('utc', now())"))
    to_seller: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    another_shop: Mapped[str] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(String(2000), nullable=True)
    is_end: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    who_added: Mapped[BigInteger] = mapped_column(BigInteger, ForeignKey("User.id"), nullable=False)
    user_who_added = relationship("User", backref="airreturn", lazy="joined", uselist=False) # !  автоматически создаем обратное отношение в другой таблице без явного указания relationship там.
    market_id: Mapped[int] = mapped_column(Integer, ForeignKey('Market.id'), nullable=False)
