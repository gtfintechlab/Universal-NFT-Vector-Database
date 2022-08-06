FROM python:3.9
ENV TORCH_HOME=/tmp/torch

COPY requirements.txt /
RUN pip install -r requirements.txt --use-deprecated=legacy-resolver

COPY . /app
WORKDIR /app

RUN celery -A tasks worker