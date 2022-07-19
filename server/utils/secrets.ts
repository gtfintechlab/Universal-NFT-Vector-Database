import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()
const DOPPLER_SERVICE_TOKEN = process.env.DOPPLER_SERVICE_TOKEN
async function getSecrets(){
    const response = await axios.get('https://api.doppler.com/v3/configs/config/secrets/download?format=json', {}, 
    {
        auth: {
          username: DOPPLER_SERVICE_TOKEN,
          password: ''
        }
    });
    return response.data
}

export default {
    getSecrets
}