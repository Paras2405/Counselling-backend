const chatModel=require('../models/chatModel')
//createchat
const createChat=async(req,res)=>{
const {firstId,secondId}=req.body

try{
const chat=await chatModel.findOne({
    members:{$all:[firstId,secondId]}
})
if(chat){
    return res.status(200).json(chat)
}
const newChat = new chatModel({
    members:[firstId,secondId]
})

const response=await newChat.save()
res.status(200).json(response)
}
catch(err){
console.log(err)
res.status(500).json(err)
}
}



//findUserchats

const findUserchats=async(req,res)=>{
const userId=req.params.userId
try{
    const chats=await chatModel.find({
        members:{$in:[userId]}
    })
    res.status(200).json(chats)
}
catch(err){
    console.log(err)
res.status(500).json(err)
}
}
//Findchat

const findChat=async(req,res)=>{
    const firstId=req.params.firstId
    const secondId=req.params.secondId
    try{
        const chat=await chatModel.findOne({
            members:{$all:[firstId,secondId]}
        })
        res.status(200).json(chat)
    }
    catch(err){
        console.log(err)
    res.status(500).json(err)
    }
    }
module.exports={createChat,findChat,findUserchats}


