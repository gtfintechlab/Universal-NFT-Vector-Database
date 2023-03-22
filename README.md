## What is the Universal NFT Vector Database

The Universal NFT Vector Database is an initiative to store a vectorized version of every image-based Ethereum NFT (ERC-721). This project leverages a variety of technology to make this possible including Alchemy API, the Graph Protocol, and Pinecone. Our complete software infrastructure can be found below:

![Software Infrastructure](https://i.imgur.com/frvpqXi.png)

## Development Cycle

Below we have outlined the major parts/systems as part of this project and their use case in our overall system.

| **System**                              | **Use Case**                                                                                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analytics Dashboard                     | This is the frontpage of our client side application, primarily used to display statistics and other information regarding the data in our database and task queue.                    |
| Search Page                             | The search page is an interactive page for users to query the database and find similar NFTs while also visualizing their NFTs relative to similar NFTs on a two-dimensional graph.    |
| Graph Protocol Integration              | The Graph Protocol is used as a querying layer to obtain all of the NFT collection information on the blockchain.                                                                      |
| Alchemy API Integration                 | Alchemy API is used to obtain all the individual NFT information for each NFT collection which is then stored in our system.                                                           |
| Backend Server                          | Our backend server allows us to interact with the data and obtain information from our databases to display on our analytics dashboard.                                                |
| RegNetY-080 Image Embedding Integration | The image embeddings serve as a way to standardize the representation of the images and store them in a vector database.                                                               |
| Search API                              | The search API allows users to query the vector database for similar NFTs based on a source image. It uses cosine distance as the metric for finding the closest NFTs.                 |
| Visualization API                       | The visualization API allows users to visualize their source image relative to similar NFTs -- it uses truncated singular value decomposition to do this.                              |
| Task Queue Worker Server                | The task queue workers server enables horizontal scalability for the system because it allows hundreds of thousands of NFTs to be sitting in a queue as they eventually get processed. |

## Supporting / Contributing to this Project

We always welcome pull requests to this repository for fixing and further improving our database.

## Installation Setup - Setup Script

We have provided a setup script available (`setup.sh`) to setup the system locally -- this has only been tested with WSL and Ubuntu so use at your own risk. Before running the setup script, please ensure you have the following installed:

- MongoDB Community Edition: https://www.mongodb.com/docs/manual/administration/install-community/
- Python 3.8+: https://www.python.org/downloads/release/python-380/
- Nodejs v16+: https://nodejs.org/en/download/

### Environment Variables

You will also need to add an enviornment file for this project. Directories with an .env file:

- `python_server/src/`
- `client/`
- `celery_queue/`
- `benchmarks/`

We have provided an `.env.example` for each .env file. We also provide a `doppler.example` to see what other environment variables we have because we use [Doppler](https://www.doppler.com/) as our unified secret management software.

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
