from wtforms import BooleanField, DateField, StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired
from flask_wtf import FlaskForm


class GetDetailForm(FlaskForm):
	vin = StringField("VIN")
	# submit = SubmitField("Отправить")


class AddDetailForm(FlaskForm):
    vin = StringField('VIN', validators=[DataRequired()])
    name = StringField('Название', validators=[DataRequired()])
    amount = IntegerField('Количество', validators=[DataRequired()])
    submit = SubmitField('Добавить')
    

class PurchaseForm(FlaskForm):
    vin = StringField("VIN детали", validators=[DataRequired()])
    amount = IntegerField("000", validators=[DataRequired()])
    date = DateField("00.00.00", validators=[DataRequired()])
    price = IntegerField("00 000.00 p", validators=[DataRequired()])
    detail_name = StringField("Рычаг", validators=[DataRequired()])
    submit = SubmitField("Оформить поступление")


class SalesForm(FlaskForm):
    vin = StringField("VIN детали", validators=[DataRequired()])
    amount = IntegerField("Количество", validators=[DataRequired()])
    date = DateField("Дата поступления", validators=[DataRequired()])
    price = IntegerField("Цена за единицу", validators=[DataRequired()])
    name = StringField("Продавец", validators=[DataRequired()])
    submit = SubmitField("Выдать")


class ReturnForm(FlaskForm):
    vin = StringField("VIN детали", validators=[DataRequired()])
    amount = IntegerField('Количество', validators=[DataRequired()])
    sell_date = DateField("Дата продажи", validators=[DataRequired()])
    return_date = DateField("Дата возврата", validators=[DataRequired()])
    to_seller = StringField('Продавец', validators=[DataRequired()])
    price = IntegerField('Цена', validators=[DataRequired()])
    comment = StringField('Комментарий', validators=[DataRequired()])
    is_compleat = BooleanField('Возврат завершен')
    submit = SubmitField('Оформить возврат')


class AirReturnForm(FlaskForm):
    vin = StringField("VIN детали", validators=[DataRequired()])
    amount = IntegerField('Количество', validators=[DataRequired()])
    sell_date = DateField("Дата продажи", validators=[DataRequired()])
    return_date = DateField("Дата возврата", validators=[DataRequired()])
    to_seller = StringField('Продавец', validators=[DataRequired()])
    price = IntegerField('Цена', validators=[DataRequired()])
    another_shop = StringField('Магазин посредник', validators=[DataRequired()])
    comment = StringField('Комментарий', validators=[DataRequired()])
    is_compleat = BooleanField('Возврат завершен')
    submit = SubmitField('Оформить возврат')
