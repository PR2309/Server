const dotenv = require('dotenv');
dotenv.config();
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


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY); // Use environment variable for API key

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: ['https://sparkv-roadmaps.netlify.app'], 
   
    credentials: true,
}));
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;
// const PORT = process.env.PORT || "https://sparkv-server.onrender.com/";


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
