import mongoose from 'mongoose';

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(url)
    .then(() => console.log('Connected to mongo'))
    .catch((err) => {
      console.error('Failed to connect with mongo');
      console.error(err);
    });
};

export default connectDB; 