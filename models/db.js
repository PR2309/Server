const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connected to database');
        });
        connection.on('error', (err) => {
            console.error('Error connecting to database:', err);
        });
    } catch (error) {
        console.error("Something is wrong", error);
    }
}

module.exports = connectDB;
