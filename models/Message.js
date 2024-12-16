const mongoose= require('mongoose')
const MessageSchema= new mongoose.Schema({
messageid:{
type:String,
required:true,
unique:true,
},
senderid:{
type:String,
required:true,
unique:true
},
receiverid:{
    type:String,
    required:true,
    unique:true
    },
messagecontent:{
    type:String,
    required:true,
},
messagestatus:{
  type:String,
  required:true,
}

})
module.exports=mongoose.model('message',MessageSchema)