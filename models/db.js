require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_CONN, {

            serverSelectionTimeoutMS: 30000,
        });
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Something is wrong", error);
    }
}

module.exports = connectDB;
