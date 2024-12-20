import os

from flask import render_template, send_from_directory

from application.utils import init_data_checker
from application import app


@app.get('/front')
@init_data_checker
def front():
    return render_template('/build/index.html')


@app.route('/static-front/<path:path>')
@init_data_checker
def static_index_build(path):
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], '/build/static/'), path)
