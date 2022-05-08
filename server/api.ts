import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import {initializeApp, cert} from 'firebase-admin/app';
import { cwd } from 'process';


const api = express();

// const serviceAccount = require(cwd() + '/firebase_credentials.json');
// initializeApp({
//   credential: cert(serviceAccount),
// });
// const database = getFirestore();


const APP_PORT = 3000;

api.get("/", (req, res) => {
    res.status(200).json({
        "Hello": "World"
    });
});

api.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`);
});