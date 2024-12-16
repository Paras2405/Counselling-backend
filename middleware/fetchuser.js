require('dotenv').config()
const jwt= require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET

const fetchuser=(req,res,next)=>{
//get user from token in header and add it to request obj
const token =req.header('auth-token')
if(!token){
    res.status(401).send({error:'Enter valid token'})
}
try{
    const data=jwt.verify(token,JWT_SECRET)
    req.user=data
    next()

}catch(err){

    res.status(401).send({error:'Enter valid token'})
}
}
module.exports=fetchuser