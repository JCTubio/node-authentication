import mongoose from 'mongoose';

const MONGOURI = process.env.DB_URI;

const initiateMongoServer = async () => {
  try{
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB')
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default initiateMongoServer;