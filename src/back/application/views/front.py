import os

from flask import render_template, send_from_directory

from application.utils import init_data_checker
# from application import app
from . import bp


@bp.get('/front/test')
@init_data_checker
def front():
    return render_template('/build/index.html')


@bp.route('/static-front/test/<path:path>')
@init_data_checker
def static_index_build(path):
    print(os.path.join('./application/templates/build/static/'))
    return send_from_directory(os.path.join(os.getcwd(),'./application/templates/build/static/'), path)
