import dotenv from 'dotenv'; // ES module import
dotenv.config();
import db from './db.js';  // Updated for ES module
import express from 'express';  // ES module import
import cors from 'cors';  // ES module import
import jwt from 'jsonwebtoken';  // Updated for ES module import
import fetch from 'node-fetch';  // ES module import
import fetchuser from './middleware/fetchuser.js';

const JWT_SECRET = process.env.JWT_SECRET;
const VIDEOSDK_API_ENDPOINT = "https://api.videosdk.live/v2";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIxYjFmOWNkZC05MjhjLTQwN2EtYWVkZS1jMjc5YzliMmFjNGQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDg2OTgyMCwiZXhwIjoxODkyNjU3ODIwfQ.LxoE15ab8O1JMjnygwhbGDyRo6UCfK4-kAUfXZhI3ZY";

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',    // Your local frontend URL
  'https://counselling-frontend.onrender.com' // Your deployed frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

app.post('/api/create-meeting', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the auth-token (for security)
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("User:", decoded);

    // Create a meeting ID
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/rooms`, {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (response.ok) {
      res.json({ meetingId: data.roomId });
    } else {
      res.status(500).json({ error: 'Failed to create meeting' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Routes
import authRoute from './routes/auth.js';
//import chatRoute from './routes/chatRoute.js';
//import messageRoute from './routes/messageRoute.js';
//import videoRoute from './routes/video.js'
app.use('/api/auth', authRoute);
//app.use('/api/video',videoRoute);
//app.use('/api/chat', chatRoute);
//app.use('/api/message', messageRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
