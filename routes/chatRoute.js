const express= require('express')
const { createChat, findUserchats, findChat } = require('../controllers/chatController')
const router=express.Router()
//createchat
router.post('/',createChat)
router.get('/:userId',findUserchats)
router.get('/find/:firstId/:secondId',findChat)

module.exports=router;