const mongoose = require('mongoose')

const messageSchema= new mongoose.Schema(

    {
     senderId:String,
     chatId:String,
     text:String,
    },
    {
        timestamps:true
    }

)
const messageModel= mongoose.model('message',messageSchema)
module.exports=messageModel