import axios from "axios";

const host = "http://127.0.0.1:5000"

async function startSearch(base64: String) {
    // const response: JSON = await axios.post(host + "/api/search", {
    //     image: base64,
    //     amount: 1
    // });

    // return response

    let mockJSONResponse = "{\"results\":[{\"1\":{\"distance\":2.3445,\"vectorId\":48957983448},\"2\":{\"distance\":7.435,\"vectorId\":48957983490}}]}"
    
    return JSON.parse(mockJSONResponse)
}


export {startSearch}