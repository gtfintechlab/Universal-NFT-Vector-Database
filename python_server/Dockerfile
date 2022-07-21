FROM python:3.8

COPY src/ app/
WORKDIR /app

ENV TORCH_HOME=/tmp/torch
RUN mkdir -p /tmp/torch/hub/checkpoints/
RUN curl -LJO https://download.pytorch.org/models/efficientnet_b5_lukemelas-b6417697.pth
RUN cp efficientnet_b5_lukemelas-b6417697.pth /tmp/torch/hub/checkpoints/

RUN pip install -r requirements.txt

ENV PORT 5000
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app