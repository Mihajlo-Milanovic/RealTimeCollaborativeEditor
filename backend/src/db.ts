import mongoose from 'mongoose';
import {configDotenv} from "dotenv";
configDotenv();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Mongo connection error:', err);
        process.exit(1);
    }
    // finally {
    //     await mongoose.disconnect();
    // }
};

export default connectDB;