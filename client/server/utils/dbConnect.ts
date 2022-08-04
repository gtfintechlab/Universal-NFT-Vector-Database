import mongoose from "mongoose";

async function dbConnect(): Promise<void> {
  const secrets = useRuntimeConfig().secretVariables;
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(secrets.MONGO_DB_URL, {
    dbName: 'testingenv',
    socketTimeoutMS: 360000
  })
    .catch((error) => {
      console.error("Unable to connect to database.");

      throw error;
    });
}

export default dbConnect;
