const mongoose = require('mongoose');

// ─── Fix: Node.js v24 uses OpenSSL 3.x which rejects MongoDB Atlas TLS certs ───
// This must be set BEFORE any mongoose.connect() call is made.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 – avoids IPv6/DNS issues on Windows with Atlas
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
