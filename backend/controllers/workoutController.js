
const LikedRecipe  =require('../models/likedRecipes')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Message = require('../models/messageModel')

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function run(prompt) {
    const p =`
You are a professional chef. Based on the following ingredients or prompt or instructions,you provide a delicious recipe or cooking idea. If the ingredients can be used in multiple ways, suggest a few options. 

Ingredients or Instructions or Prompt: ${prompt}

Please provide a recipe with step-by-step instructions, and include tips for enhancing the dish. If you can't create a specific recipe, suggest alternative uses or ideas for the ingredients provided.
`
    const result = await model.generateContent(p);
    const response = await result.response;
    const text = response.text();
    return text;
}

const likeRecipe = async (req, res) => {
    try {
        const { recipeId, recipe } = req.body;
        
        const token = req.headers.authorization.split(' ')[1]; // Assuming you're sending the token in the Authorization header
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded)
        const userId = decoded._id;
        
        console.log('After splitting'+recipeId)
        // Check if the recipe is already liked
        const existingLike = await LikedRecipe.findOne({ userId, recipeId });
        if (existingLike) {
            return res.status(400).json({ message: 'Recipe already liked' });
        }

        // Create a new liked recipe
        const newLikedRecipe = new LikedRecipe({
            userId,
            recipeId,
            recipe
        });

        await newLikedRecipe.save();
        res.status(201).json({ message: 'Recipe liked successfully', likedRecipe: newLikedRecipe });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const unlikeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded._id;

        const result = await LikedRecipe.findOneAndDelete({ userId, recipeId });
        if (!result) {
            return res.status(404).json({ message: 'Liked recipe not found' });
        }

        res.json({ message: 'Recipe unliked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getLikedRecipes = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded._id;

        // const likedRecipes = await LikedRecipe.find({ userId });
        // res.json(likedRecipes);
        const likedRecipes = await LikedRecipe.find({ userId }).lean(); // .lean() converts documents to plain JavaScript objects

        // Ensure that the result is an array
        const likedRecipesArray = Array.isArray(likedRecipes) ? likedRecipes : [likedRecipes];

        // Send the array as JSON response
        res.json(likedRecipesArray);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const gemini = async (req,res)=>{
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

        
        const response = await run(text)

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
            'text': response,
            'role': 'bot',
            'timestamp': new Date().toISOString()  // Using the current time for bot message timestamp
        });
        await botMessage.save();

        return res.status(200).json({'data':response});
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


module.exports = {
    likeRecipe,unlikeRecipe,getLikedRecipes,gemini
}