

const express = require('express')
const {signupUser, loginUser,generate,getMessages} = require('../controllers/userController')
// const {signupUser, loginUser, generate, getMessages} = require('../controllers/userController')
const {likeRecipe,unlikeRecipe,getLikedRecipes,gemini} = require('../controllers/workoutController')
const router = express.Router()

//login
router.post('/login',loginUser)

//signup
router.post('/signup',signupUser)

router.post('/generate', generate);
router.get('/get-messages',getMessages)

router.post('/like-recipe', likeRecipe);
router.delete('/unlike-recipe/:recipeId', unlikeRecipe);
router.get('/liked-recipes', getLikedRecipes);

router.post('/gemini',gemini)

module.exports = router
