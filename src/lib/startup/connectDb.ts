import mongoose from 'mongoose';

const MONGODB_STRING = process.env.MONGODB_URI

if (!MONGODB_STRING) {
  throw new Error('Please define the MONGO_DB environment variable.');
}

export const connectDb = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_STRING);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};
