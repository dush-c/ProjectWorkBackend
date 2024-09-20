import 'reflect-metadata';
import app from './app';
import mongoose from 'mongoose';

// Replace this with your actual MongoDB URI from MongoDB Atlas
const uri = 'mongodb+srv://giovannimeneghello:L2OefCiUbJ7xXaKk@clusteprimo.vdi3tck.mongodb.net/';

mongoose.set('debug', true);
mongoose.connect(uri, {
})
  .then(_ => {
    console.log('Connected to the online database');
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
