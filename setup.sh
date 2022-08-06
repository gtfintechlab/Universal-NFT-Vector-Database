#!/bin/bash

# Linux Operating Systems
if [[ $OSTYPE == "linux-gnu"* ]]; then
    cd client
    npm install
    cd ..

    cd python_server/src
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    cd ..
    cd ..

    cd celery_queue
    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt
    cd ..
fi