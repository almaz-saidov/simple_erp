from werkzeug.security import generate_password_hash

# Генерация хеша для пароля "grosh"
password_hash = generate_password_hash("grosh")
print(password_hash)
