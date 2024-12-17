# pip install beautifulsoup4
import os
from bs4 import BeautifulSoup

# Путь к HTML файлу
html_file_path = '../main/build/index.html'

# Папки для CSS и JS файлов
css_dir = '../main/build/static/css/'
js_dir = '../main/build/static/js/'

# Чтение HTML файла
with open(html_file_path, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Парсинг HTML с помощью BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Удаление всех тегов <script> с заданными атрибутами
for script_tag in soup.find_all('script'):
    if script_tag.get('defer') == 'defer' and script_tag.get('src', '').startswith('./static/js/'):
        script_tag.decompose()  # Удаляем тег

# Чтение всех CSS файлов и вставка их содержимого в <style> перед </head>
css_content = ""
for filename in os.listdir(css_dir):
    if filename.endswith('.css'):
        with open(os.path.join(css_dir, filename), 'r', encoding='utf-8') as css_file:
            css_content += css_file.read() + '\n'

if css_content:
    style_tag = soup.new_tag('style')
    style_tag.string = css_content
    head_tag = soup.find('head')
    head_tag.insert(len(head_tag.contents), style_tag)  # Вставка перед </head>

# Чтение всех JS файлов и вставка их содержимого перед </body>
js_content = ""
for filename in os.listdir(js_dir):
    if filename.endswith('.js'):
        with open(os.path.join(js_dir, filename), 'r', encoding='utf-8') as js_file:
            js_content += js_file.read() + '\n'

if js_content:
    script_tag = soup.new_tag('script')
    script_tag.string = js_content
    body_tag = soup.find('body')
    body_tag.insert(len(body_tag.contents), script_tag)  # Вставка перед </body>

# Записываем изменённый HTML обратно в файл
with open('modified_file.html', 'w', encoding='utf-8') as file:
    file.write(str(soup))

print("HTML файл успешно модифицирован!")
