const mongoose= require('mongoose')
const PaymentSchema= new mongoose.Schema({
paymentamount:{
type:Number,
required:true
},
paymentstatus:{
type:Boolean,
required:true,
},
paymentid:{
    type:Number,
    unique:true,
    required:true

}


})
module.exports=mongoose.model('payment',PaymentSchema)