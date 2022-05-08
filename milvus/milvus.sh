#!/bin/bash

if [[ $1 == "start" ]]; then
    {
        if [ -d "volumes/" ]; then 
            rm -rf "volumes/"
        fi
        docker-compose up -d
    } || {
        docker-compose down
        if [ -d "volumes/" ]; then 
            rm -rf "volumes/"
        fi
        docker-compose up -d
    }
fi

if [[ $1 == "end" ]]; then
    docker-compose down
    if [ -d "volumes/" ]; then 
        rm -rf "volumes/";
    fi  
fi