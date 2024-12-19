require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const JWT_SECRET =process.env.JWT_SECRET
const fetchuser = require('../middleware/fetchuser');
const {OAuth2Client}= require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Create a user using POST "/api/auth/"
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter correct email address').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('mobileno', 'Mobile Number is of 10 characters').isLength({ min: 10 }),

], async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success:false,error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            mobileno:req.body.mobileno,
            role:req.body.role

        });

        const data = {
            id: user.id,
            name: user.name  
        };
        const jwtData = jwt.sign(data, JWT_SECRET);
        success=true
        res.json({success, authtoken: jwtData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login a user using POST "/api/auth/login"
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            success=false
            return res.status(400).json({ success,message: 'User does not exist' });
        }

        const passwordCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCompare) {
            success=false
            return res.status(400).json({success,error: 'Password of the user is incorrect' });
        }

        const data = {
            id: user.id,

            name: user.name  
        };
        const  authtoken = jwt.sign(data, JWT_SECRET);
        success=true
        res.json({success,  authtoken});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get logged-in user details using POST "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({ success: true, name: user.name, email: user.email, mobileno: user.mobileno, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/google-login',async(req,res)=>{
    try{
const {token}=req.body
const ticket = await client.verifyIdToken({
    idToken:token,
    audience:process.env.GOOGLE_CLIENT_ID
})
const payload = ticket.getPayload();
const userId = payload.sub;
    
      // Check if the user exists in your database
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        // If no user exists, create a new one
        user = await User.create({
          googleId: userId,
          email: payload.email,
          name: payload.name,
          mobileno: 'N/A', // Provide defaults for required fields
          password: 'N/A', // Provide defaults for required fields
          role: 'user',    // Set default role
        });
      } else if (!user.googleId) {
        // If the user exists but doesn't have a Google ID, update the record
        user.googleId = userId;
        await user.save();
      }
     // Generate your own JWT token
     const authtoken = jwt.sign({ id: user.id ,  name: user.name  }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
     res.json({ success: true, authtoken });
   } catch (error) {
     console.error('Error verifying Google token:', error);
     res.status(401).json({ success: false, message: 'Invalid Google token' });
   }
})

module.exports = router;