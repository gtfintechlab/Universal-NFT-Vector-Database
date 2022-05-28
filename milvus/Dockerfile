# Use Python3.9
FROM python:3.9
# Copy requirements.txt to the docker image and install packages
COPY requirements.txt /
RUN pip install -r requirements.txt --use-deprecated=legacy-resolver
# Set the WORKDIR to be the folder
COPY . /app
WORKDIR /app
# Use gunicorn as the entrypoint
CMD [ "python", "task_queue.py" ]