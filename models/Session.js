const mongoose= require('mongoose')
const SessionSchema= new mongoose.Schema({
sessiontype:{
type:String,
required:true
},
sessionstatus:{
type:String,
required:true,

},
sessionid:{
type:Number,
unique:true,
required:true,
},
sessionduration:{
type:Number,
required:true
},
sessiondate:{
    type:Date,
    required:true
    },



})
module.exports=mongoose.model('session',SessionSchema)