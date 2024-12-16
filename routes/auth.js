require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const JWT_SECRET =process.env.JWT_SECRET
const fetchuser = require('../middleware/fetchuser');

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
            id: user.id
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
            id: user.id
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
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;