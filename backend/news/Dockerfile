FROM python:3.11-slim

WORKDIR /app
COPY /requirements.txt /app/
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . /app/
RUN python manage.py migrate
