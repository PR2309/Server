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
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ CORS Setup (Fixes the Issue)
const allowedOrigins = ['https://sparkv-roadmaps.netlify.app'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ AI Function
async function run(name, age, level, language, days, problem) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a friendly assistant for a Roadmap Website named SparkV. 
    I am a user named ${name}, aged ${age}. I am at ${level} level in ${language}, and I have ${days} days to learn. 
    Provide a roadmap customized according to my details. Also consider ${problem}, if mentioned. 
    Response must be in JSON format.`;

    console.log("Generated Prompt: ", prompt);

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("AI Response: ", text);
        return text;
    } catch (error) {
        console.error("Error generating AI content:", error);
        throw new Error("Failed to generate content");
    }
}

// ✅ API Routes
app.use('/api', router);

app.post('/ai/ans', async (req, res) => {
    const { name, age, level, language, days, problem } = req.body;
    try {
        const roadmap = await run(name, age, level, language, days, problem);
        res.json({ roadmap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// ✅ Connect to DB & Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Failed to connect to the database:", error);
    });
