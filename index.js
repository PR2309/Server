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

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Proper CORS Setup
// const allowedOrigins = ['https://sparkv-roadmaps.netlify.app'];
// app.use(cors({
//     // origin: function (origin, callback) {
//     //     if (!origin || allowedOrigins.includes(origin)) {
//     //         callback(null, origin);
//     //     } else {
//     //         callback(new Error('Not allowed by CORS'));
//     //     }
//     // },
//     origin: allowedOrigins[0],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
const corsOptions = {
    origin: ['http://localhost:3000', 'https://sparkv-roadmaps.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// ✅ AI Function
async function run(name, age, level, language, days, problem) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Your are a friendly assistant for a Roadmap Website named SparkV. I am a user named ${name}, having age ${age}, I am at ${level} level in ${language}, I have ${days}, Provide a roadmap customised according to the data I provided, if ${problem}, In JSON format.`;
    
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
        res.status(500).send('An error occurred');
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
