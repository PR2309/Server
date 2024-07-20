const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        // const connection = mongoose.connection;

    
    } catch (error) {
        console.error("Something is wrong", error);
    }
}

module.exports = connectDB;
