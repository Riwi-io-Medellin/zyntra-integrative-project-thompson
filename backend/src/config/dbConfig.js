import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


import mongoConfig from './mongo.js';

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado");
    } catch (error) {
        console.error(error);
    }
};

export default connectMongo;

