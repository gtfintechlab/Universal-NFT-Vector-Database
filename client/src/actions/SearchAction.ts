import axios from "axios";

const host = "http://127.0.0.1:5000"

async function startSearch(base64: String) {
    const response = await axios.post(host + "/api/milvus/search", {
        image: base64,
        amount: 1
    });

    let mockJSONResponse = {
        "results": [{
            "1": {
                "distance": 2.3445,
                "milvusId": 48957983448
             },
      
            "2": {
                "distance": 7.435,
                "milvusId": 48957983490
             }
      
         }]
      }
    
    return mockJSONResponse
}


export {startSearch}