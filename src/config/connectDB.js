import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect to MongoDB
*/
let ConnectBD = () => {
    mongoose.Promise = bluebird;

    // Connect DB on local
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log("Connected database successfully.");
    return mongoose.connect(URI, { useMongoClient: true });
}

module.exports = ConnectBD;
