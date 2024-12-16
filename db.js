
require('dotenv').config();
const mongoose=require('mongoose')

//define mongoDB connection url
//const MongoURI="mongodb+srv://paraskadam0605:uz9S18xVFTAIYjQj@cluster0.kfvv7.mongodb.net/"
//const MongoURI=process.env.MONGO_URI||"mongodb+srv://paraskadam0605:uz9S18xVFTAIYjQj@cluster0.kfvv7.mongodb.net/"
//const mongoURL=process.env.DBURL_LOCAL
//const mongoURL=process.env.DBURL;

const MongoUri=process.env.MONGO_URI
const port=process.env.PORT 


mongoose.connect( MongoUri, {
    serverSelectionTimeoutMS: 30000
  // You can remove useNewUrlParser and useUnifiedTopology as they are no longer needed.
})
.then(() => console.log(`MongoDB connected at port ${port}`))
.catch(err => console.log('MongoDB connection error', err));

const db=mongoose.connection;
//db=>it is used to handle events and interact with the database
db.on('connected',()=>{
    console.log('Connected to the MongoDB server');
})
db.on('error',(err)=>{
    console.log('MongoDB connection error',err);
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected');
})
module.exports=db;//export db connection