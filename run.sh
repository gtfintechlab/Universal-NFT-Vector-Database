#!/bin/bash

if [[ $1 == "start" && $OSTYPE == "linux-gnu"* ]]; then
    mkdir -p pids
    nohup bash -c 'npm start --prefix client/' &

    cd python_server/src
    source venv/bin/activate
    nohup bash -c 'python app.py' &
    cd ..
    cd ..

    cd task_queue
    source venv/bin/activate
    nohup bash -c 'celery -A tasks worker' &
    TASK_QUEUE_PID=$!
    cd ..
    echo ${TASK_QUEUE_PID} > pids/task_queue.pid;
fi

if [[ $1 == "end" && $OSTYPE == "linux-gnu"* ]]; then
    lsof -i:3000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    lsof -i:5000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    kill `cat pids/task_queue.pid`;
    rm -rf pids/

    cd python_server/src
    rm nohup.out
    cd ..
    cd ..

    rm nohup.out
fi