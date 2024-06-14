const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => { console.log("Database Connected!"); })
    .catch(() => { console.log("Error while connecting to database"); })