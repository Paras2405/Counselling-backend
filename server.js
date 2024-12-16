const dotenv=require('dotenv')
dotenv.config()
const db=require('./db');
const PORT=process.env.PORT
const express=require('express')
const cors= require('cors')


const app=express();
app.use(express.json())
app.use(cors({
  origin: 'https://counselling-frontend-nkm8..vercel.app',  // Replace with your frontend's URL
  methods: ['GET', 'POST'],
}))
  //app.options('*', cors()); 


// This will handle preflight requests

app.use('/api/auth',require('./routes/auth')
)


app.listen(PORT,()=>{
    console.log(`App listening at ${PORT}`)
})