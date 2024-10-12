
# SparkV Server / Backend

## Overview
This repository contains the frontend code for the SparkV application, a roadmap and learning path platform designed to help users track their progress in various subjects. The application is built using the MERN stack and integrates AI capabilities to enhance the user experience.

## Deployed Links
- **Frontend Repo:** [SparkV Frontend](https://github.com/PR2309/SparkV_Frontend)
- **Backend Repo:** [SparkV Frontend](https://github.com/PR2309/Server)
- **Live Website:** [SparkV Roadmaps Frontend on Netlify](https://sparkv-roadmaps.netlify.app/)

## Tech Stack
- **Frontend:** React.js, Bootstrap, HTML, CSS, JavaScript
- **Backend:** Node.js, Express (refer to backend repository)
- **Integration:** MERN stack with AI capabilities
- **Deployment:** Netlify, Render

## Setup Instructions
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PR2309/Server.git
   cd Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory** to store your environment variables. This prevents sensitive information from being exposed in the codebase:
   ```plaintext
   PORT=<your_port>
   MONGO_CONN=<your_mongodb_url>
   FRONTEND_URL=<your>
   SECRET_KEY=<your_jwt_secret>
   GOOGLE_AI_API_KEY=<your_genai_api_key>
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## Clone This Repository
To clone this repository, use the following command:
```bash
git clone https://github.com/PR2309/Server.git
```
