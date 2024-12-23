import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout in case of connection issues
    });

    console.log(`MongoDB connected successfully at port ${port}`);

    // Attach event listeners for connection events
    mongoose.connection.on('connected', () => {
      console.log('Connected to the MongoDB server');
    });

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (err) {
    // Catch and log errors if the connection fails
    console.error('MongoDB connection error', err);
    process.exit(1); // Exit the process if we can't connect
  }
};

connectDB();

// Export the db connection for use in other parts of the application
export default mongoose.connection;
