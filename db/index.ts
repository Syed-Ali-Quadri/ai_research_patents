import mongoose from 'mongoose';

// Cache connection promise to prevent concurrent connect attempts
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
    // Validate MongoDB URI at connection time
    const rawMongoURI = process.env.MONGODB_URI;
    if (!rawMongoURI || rawMongoURI.trim() === '') {
        throw new Error(
            'Missing MONGODB_URI environment variable. ' +
            'Please add MONGODB_URI=your_connection_string to your .env file. ' +
            'Example: MONGODB_URI=mongodb://localhost:27017/your-database'
        );
    }
    const mongoURI: string = rawMongoURI;

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB already connected');
        return mongoose;
    }

    // Check if connection is in progress
    if (mongoose.connection.readyState === 2) {
        console.log('MongoDB connection in progress, waiting...');
        if (connectionPromise) {
            return connectionPromise;
        }
    }

    // Return existing connection promise if available
    if (connectionPromise) {
        return connectionPromise;
    }

    // Create new connection promise
    connectionPromise = mongoose.connect(mongoURI)
        .then((connection) => {
            console.log('MongoDB connected:', connection.connection.host);
            return connection;
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
            connectionPromise = null; // Reset promise on error to allow retry
            throw error; // Propagate error instead of calling process.exit
        });

    return connectionPromise;
}

export default connectDB;