#!/bin/bash

if [[ $1 == "start" ]]; then
    nohup bash -c 'npm start --prefix server/' &
    nohup bash -c 'npm start --prefix client/' &
    nohup bash -c 'python_server/venv/bin/python python_server/api.py' &

    cd milvus
    ./milvus.sh start
    cd ..

    nohup bash -c 'milvus/venv/bin/python milvus/task_queue.py' &
    echo $! > task_queue.pid;
fi

if [[ $1 == "end" ]]; then
    lsof -i:3000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    lsof -i:4000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    lsof -i:5000 -Fp | head -n 1 | sed 's/^p//' | xargs kill
    kill `cat task_queue.pid`;

    cd milvus
    ./milvus.sh end
fi