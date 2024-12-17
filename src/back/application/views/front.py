from flask import render_template

from application.utils import init_data_checker
from application import app


@app.get('/front')
@init_data_checker
def front():
    return render_template('main/index.html')
