const dotenv=require('dotenv')
dotenv.config()
const db=require('./db');
const PORT=process.env.PORT
const express=require('express')
const cors= require('cors')


const app=express();
app.use(express.json())
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
/*app.use(cors({
  origin: 'https://counselling-frontend.onrender.com',  // Replace with your frontend's URL
  methods: ['GET', 'POST'],
}))*/
  //app.options('*', cors()); 


// This will handle preflight requests

app.use('/api/auth',require('./routes/auth')
)
app.use('/api/chat',require('./routes/chatRoute'))
app.use('/api/message',require('./routes/messageRoute'))

app.listen(PORT,()=>{
    console.log(`App listening at ${PORT}`)
})
