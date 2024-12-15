from application import app

if __name__=="__main__":
	# print("Список зарегистрированных маршрутов:", app.url_map)
	app.run(debug=True)