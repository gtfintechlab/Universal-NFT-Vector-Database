#!/bin/bash

if [[ $1 == "start" && $OSTYPE == "linux-gnu"* ]]; then
    nohup bash -c 'npm start --prefix server/' &
    nohup bash -c 'npm start --prefix client/' &
    nohup bash -c 'python_server/src/venv/bin/python python_server/src/app.py' &
    nohup bash -c 'task_queue/venv/bin/python task_queue/task_queue.py' &
    echo $! > task_queue.pid;
    mongod
fi

if [[ $1 == "end" && $OSTYPE == "linux-gnu"* ]]; then
    lsof -i:3000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    lsof -i:4000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    lsof -i:5000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    kill `cat task_queue.pid`;
    mongod --shutdown

fi