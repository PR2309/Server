// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const router = require('./routes/index')

// const connectDB = require('./models/db');
// const cookieParser = require('cookie-parser');

// const app = express();

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// const PORT = process.env.PORT || 8080;

// app.get('/', (req, res) => {
//     res.json({
//         message: "Server running at " + PORT
//     });
// });

// app.use('/api',router);




// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("Server running at " + PORT);
//     });
// }).catch((error) => {
//     console.error("Failed to connect to the database:", error);
// });



const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes/index');
const connectDB = require('./models/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');

const app = express();

// Initialize Google Generative AI with the API key from your environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY); // Use environment variable for API key

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Function to run the AI model
async function run(name, problem) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an assistant for a Roadmap Website named SparkV. I am a user named ${name} and I want you to write a roadmap for me if ${problem}`;
    console.log("Question: " + prompt);
    
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("Answer: " + text);
        return text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content");
    }
}

// API route for generating AI responses
app.use('/api', router);
app.post('/ai/ans', async (req, res) => {
    const { name, problem } = req.body;
    try {
        const letter = await run(name, problem);
        res.json({ letter });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
});
