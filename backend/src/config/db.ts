import mongoose from 'mongoose';
import { mongoURI } from "./config";

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Mongo connection error:', err);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
}