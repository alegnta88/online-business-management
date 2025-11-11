import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection failed: MONGO_URI is missing in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
  });
  console.log('Successfully connected to MongoDB');
}

export default connectToDatabase;