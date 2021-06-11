import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect to MongoDB
*/
let ConnectBD = () => {
    mongoose.Promise = bluebird;

    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    
    return mongoose.connect(URI, {useMongoClient: true});
}

module.exports = ConnectBD;
