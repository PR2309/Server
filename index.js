const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const connectDB = require('./models/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');

const app = express();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// ✅ Proper CORS Setup
const corsOptions = {
    origin: 'https://sparkv-roadmaps.netlify.app',
    // origin: 'http://localhost:3000', // for testing
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;

// ✅ AI Function
let lastRequestTime = 0;
const requestDelay = 60000 / 60; // 60 requests per minute = 1 request per second
async function run(name, age, level, language, days, problem) {
    // delay
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < requestDelay) {
        await new Promise(resolve => setTimeout(resolve, requestDelay - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a friendly assistant for a Roadmap Website named SparkV. 
I am a user named ${name}, aged ${age}. I am at ${level} level in ${language}, and I have ${days} days to study. 
Provide a structured roadmap in a simple, step-by-step format using bullet points. 
Each step should be clear and easy to follow. If there is a specific problem (${problem}), address it accordingly. 
DO NOT return JSON, code blocks, or special formatting. Just provide a normal text response in a document-style format.`;

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

app.use('/api', router);

app.post('/ai/ans', async (req, res) => {
    const { name, age, level, language, days, problem } = req.body;
    try {
        const letter = await run(name, age, level, language, days, problem);
        res.json({ letter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
        // res.status(500).send('An error occurred');
    }
});

// ✅ Connect to DB & Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
});
