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

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = ['https://6696719-gleeful-malasada-bbcb5a.netlify.app', 'https://cool-llama-1258e5.netlify.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 8080;

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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
});
