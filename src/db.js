import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = `mongodb://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@${process.env.DB_MONGO_HOST}:${process.env.DB_MONGO_PORT}/${process.env.DB_MONGO_DATABASE}?authSource=admin`

export const dbConnection = () => {
    //return mongoose.connect(MONGO_URI, {});
    return mongoose.connect(process.env.MONGO_URI_ATLAS, {})
};
