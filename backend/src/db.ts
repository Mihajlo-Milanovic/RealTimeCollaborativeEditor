import mongoose from 'mongoose';
import {configDotenv} from "dotenv";
configDotenv();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Mongo connection error:', err);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
}

export default { connectDB, disconnectDB };