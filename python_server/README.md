## Search API Link

https://universal-nft-vector-database.web.app/

## Useful Commands

**Submit New Docker Image:** `gcloud builds submit --tag gcr.io/universal-nft-vector-database/search-api --timeout=3600`

**Deploy New Docker Image:** `gcloud run deploy --image gcr.io/universal-nft-vector-database/search-api --update-env-vars DOPPLER_SERVICE_TOKEN=<ENTER_DOPPLER_SERVICE_TOKEN_HERE>`

**Connect to Firebase Hosting:** `firebase deploy`
