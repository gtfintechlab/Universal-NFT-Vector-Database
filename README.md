## What is the Universal NFT Vector Database

The Universal NFT Vector Database is an initiative started by the Georgia Tech FinTech Lab in an effort to store a vectorized version of every image-based Ethereum NFT (ERC-721). This project leverages a variety of technology to make this possible including Alchemy API, the Graph Protocol, and Pinecone.io.

## Project Milestones

| **Milestone**                                   | **Progress** |
| ----------------------------------------------- | ------------ |
| Initial Project Setup                           | ✅           |
| Analytics Dashboard                             | ✅           |
| Integrate the Graph Protocol                    | ✅           |
| Integrate Alchemy API                           | ✅           |
| Create Backend Server                           | ✅           |
| Integrate with EfficientNet Image Embeddings    | ✅           |
| Vector Database Search API                      | ✅           |
| Vector Database Visualization API               | ✅           |
| Task Queue Worker Server                        | ✅           |
| Deploy Search API                               | ✅           |
| Deploy Dashboard                                | ✅           |
| Deploy Vector Processing Script                 | ✅           |
| Deploy Backend Server                           | ✅           |
| Search Page                                     | ✅           |

## Supporting / Contributing to this Project

We always welcome pull requests to this repository for fixing and further improving our database. Alternatively, if you would like to sponsor this project, please reach out to ssahoo61@gatech.edu

## Installation Setup - Setup Script
We have provided a setup script available (`setup.sh`) to setup the system locally -- this has only been tested with WSL and Ubuntu so use at your own risk. Before running the setup script, please ensure you have the following installed:
- MongoDB Community Edition: https://www.mongodb.com/docs/manual/administration/install-community/
- Python 3.8+: https://www.python.org/downloads/release/python-380/
- Nodejs v16+: https://nodejs.org/en/download/ 

### Environment Variables
You will also need to add an enviornment file for this project. Please contact Samrat to obtain this environment variable; Directories with an .env file:
- `python_server/src/`
- `client/`
- `celery_queue/`
- `benchmarks/`

### Run Setup Script
Then, to Setup this project:

```
sudo chmod +x ./setup.sh
sudo ./setup.sh
```

## Manual Installation
Alternatively, to setup this project manually:

- Go to the `client` folder and npm install all of the dependencies:
```
cd client
npm install
```
- Go to the `python_server/src` folder and create a python virtual environment folder. Then install all of the dependencies:
```
cd python_server/src
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
- Go to the `celery_queue/` folder and create a python virtual environment folder. Then install all of the dependencies:
```
cd celery_queue
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

## Run the Project - Run Script
- To Run this Project:
```
sudo chmod +x ./run.sh
sudo ./run.sh
```

## Run the Project - Manual Run
- Run the Client:
```
npm start --prefix client/
```
- Activate the python server virtual enviornment and run the search API:
```
cd python_server/src
source venv/bin/activate
python app.py
``` 
- Activate the Celery queue virtual enviornment and run the task queue
```
cd celery_queue
source venv/bin/activate
celery -A tasks worker
```