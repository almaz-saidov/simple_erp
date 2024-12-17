#!/bin/bash

# Переход в папку ../auth
cd ../auth || { echo "Не удалось перейти в ../auth"; exit 1; }
cp -rf build ../build/auth/
# Запуск npm run build в папке auth
#npm run build || { echo "Ошибка при запуске npm run build в ../auth"; exit 1; }
pwd
# Переход в папку ../main
cd ../main || { echo "Не удалось перейти в ../main"; exit 1; }
cp -rf build ../build/main/
# Запуск npm run build в папке main
#npm run build || { echo "Ошибка при запуске npm run build в ../main"; exit 1; }
pwd
# Переход в папку ../helpers
cd ../helpers || { echo "Не удалось перейти в ../helpers"; exit 1; }
# Запуск python3 inline.py в папке helpers
python3 build.py || { echo "Ошибка при запуске python3 build.py в ../helpers"; exit 1; }
pwd
mv  modified_file.html ../build/main/modified_file.html