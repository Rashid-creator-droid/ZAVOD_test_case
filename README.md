# ZAVOD test case

# Стек технологий
<div id="badges" align="center">
  <img src="https://img.shields.io/badge/Python%203.11-FFD43B?style=for-the-badge&logo=python&logoColor=blue"/>
  <img src="https://img.shields.io/badge/Django%20-green?style=for-the-badge&logo=django&"/>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>

  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/>
</div>

# Описание проекта

### Регистрация и авторизация.
Пользователь имеет возможность зарегистрироваться и авторизоваться в системе.

### Главная страница.
На главной странице отображаются все посты. Есть возможность бесконечного скроллинга, новые посты будут подгружаться по мере 
скролла вниз.

### Теги.
Есть возможность сортировки постов по тегам.

### Страница поста.
Каждый пост можно просмотреть в отдельно вкладке, кликнув на название.

### Статистика.
Статистика отображает кол-во просмотров за всё время. И выводятся названия топ-3х постов с самыми большими просмотрами.

# Установка проекта.

## Установка проекта из репозитория  GitHub.
### Установить Python 3.11
- Для Windows https://www.python.org/downloads/
- Для Linux 
```
sudo apt update
sudo apt -y install python3-pip
sudo apt install python3.11
``` 
### Клонировать репозиторий и перейти в него в командной строке.
```
https://github.com/Rashid-creator-droid/ZAVOD_test_case.git
``` 
###  Развернуть виртуальное окружение.
```
python -m venv venv

``` 
 - для Windows;
```
venv\Scripts\activate.bat
``` 
 - для Linux и MacOS.
``` 
source venv/bin/activate

``` 
### Перейти в ветку dev/start
```
git checkout dev/start
``` 
### Установить систему контроля зависимостей Poetry
```
pip install poetry
``` 
### Установить зависимости
```
poetry install
``` 
### Установка .pre-commit hook
```
pre-commit install
```
### Перейти в папку news
```
cd news
```
### Команды для применения миграций
```
python manage.py migrate
```
### Запуск проекта
```
python manage.py runserver 8001
```
## Установка контейнера Docker
### Склонировать репозиторий
```
https://github.com/Rashid-creator-droid/ZAVOD_test_case.git
``` 
### Перейти в ветку dev/start
```
git checkout dev/start
``` 
### Перейти в папку infra
```
cd infra
```
### Запустить сборку образа
```
sudo docker-compose up -d
``` 

# Документация API будет доступна по адресу.
```
http://localhost:8001/api/schema/swagger-ui/
``` 
