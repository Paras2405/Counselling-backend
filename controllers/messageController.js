const messageModel= require('../models/messageModel')

//createMessage

const createMessage=async(req,res)=>{
    try{
const {senderId,chatId,text}=req.body
const message = new messageModel({
    senderId:senderId,
    chatId:chatId,
    text:text,
})
const response=await message.save()
res.status(200).json(response)
    }
    catch(err){
        console.log(err)
res.status(500).json(err)
    }
}

//getMessage

const getMessages=async(req,res)=>{
    const chatId=req.params.chatId
    try{
const messages=await messageModel.find({chatId})
res.status(200).json(messages)
    }
    catch(err){
        console.log(err)
res.status(500).json(err)
    }

}



module.exports={createMessage,getMessages}