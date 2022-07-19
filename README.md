## What is the Universal NFT Vector Database

The Universal NFT Vector Database is an initiative started by the Georgia Tech FinTech Lab in an effort to store a vectorized version of every image-based Ethereum NFT (ERC-721). This project leverages a variety of technology to make this possible including Alchemy API, the Graph Protocol, and Milvus.

## Project Milestones

| **Milestone**                                   | **Progress** |
| ----------------------------------------------- | ------------ |
| Initial Project Setup                           | ✅           |
| Analytics Dashboard                             | ✅           |
| Integrate the Graph Protocol                    | ✅           |
| Integrate Alchemy API                           | ✅           |
| Create Backend Server                           | ✅           |
| Integrate Pinecone with Towhee Image Embeddings | ✅           |
| Vector Database Search API                      | ✅           |
| Vector Processing Script                        | ✅           |
| Deploy Search API                               | ✅           |
| Deploy Dashboard                                | ✅           |
| Deploy Vector Processing Script                 |              |
| Deploy Backend Server                           | ✅           |
| Search Page                                     | ✅           |

## System Design

<p align="center">
    <img src="https://i.ibb.co/XXWF6wx/system-design.png"/>
</p>

## Supporting / Contributing to this Project

We always welcome pull requests to this repository for fixing and further improving our database. Alternatively, if you would like to sponsor this project, please reach out to ssahoo61@gatech.edu

## Dev Notes

To Setup this Project (WSL or Ubuntu Only):

```
sudo chmod +x ./setup.sh
sudo ./setup.sh
```

To Run this Project:

```
sudo chmod +x ./run.sh
sudo ./run.sh
```

Directories with env File:

- `python_server/src/`
- `server/`
- `task_queue/`
