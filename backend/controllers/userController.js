
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Message = require('../models/messageModel')

const createToken = (_id) => {
    return jwt.sign({_id},process.env.SECRET,{expiresIn : '3d'})
}

//loginUser
const loginUser = async (req,res)=>{
    // res.json({mssg: "login user" })
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({username: user.username, email, token})
    }catch(error) {
        res.status(400).json({error : error.message})
    }
}

//signupUser
const signupUser = async (req,res)=>{
    // res.json({mssg: "signup user" })
    const {username, email, password} = req.body
    try{
        const user = await User.signup(username, email, password)
        const token = createToken(user._id)
        res.status(200).json({username, email, token})
    } catch(error){
        res.status(400).json({error: error.message})
    }
}


const generate = async (req, res) => {
    const { text, max_length, timestamp } = req.body;

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const uid = decoded._id;

        console.log(text, max_length);

        let local = 'https://8000-01j3mhkr02ke60prkzkn5zhag9.cloudspaces.litng.ai/generate';
        console.log('generating');
        const response = await axios.post(local, { text, max_length });
        let data = response.data;
        console.log(data);

        // Save the user message to MongoDB
        const userMessage = new Message({
            uid,
            text,
            role: 'user',
            timestamp: timestamp || new Date().toISOString()  // Use provided timestamp or current time
        });
        await userMessage.save();

        // Save the bot response to MongoDB
        const botMessage = new Message({
            uid,
            text: data.text,
            role: 'bot',
            timestamp: new Date().toISOString()  // Using the current time for bot message timestamp
        });
        await botMessage.save();

        return res.status(200).json(data);
    } catch (error) {
        console.log('ERRORRR:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
}


const getMessages = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded._id;
        console.log(userId)
        const messages = await Message.find({ uid: userId }).sort({ timestamp: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {signupUser, loginUser, generate, getMessages}

