const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in env');
  await mongoose.connect(uri, { dbName: 'whatsapp' });
  console.log('MongoDB connected');
};

module.exports = connectDB;
