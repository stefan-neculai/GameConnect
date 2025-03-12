require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    fetchGames(); // Initial call to start the process
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
  });

// Sample fetchGames function
function fetchGames() {

}