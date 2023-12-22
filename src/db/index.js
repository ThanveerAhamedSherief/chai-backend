import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const connectDB = async () => {
    try {
        console.log('dsd', process.env.MONGODB_URI);
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongob Db connected`);
    } catch (error) {
        console.log('Error', error);
        process.exit(1);
    }
};

export default connectDB;