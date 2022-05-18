FROM python:3.8

COPY src/ app/
WORKDIR /app
RUN pip install -r requirements.txt

ENV PORT 5000
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app