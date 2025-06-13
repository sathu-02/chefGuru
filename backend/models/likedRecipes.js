// models/LikedRecipe.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likedRecipeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: String, required: true },
  recipe: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

const LikedRecipe = mongoose.model('LikedRecipe', likedRecipeSchema);

module.exports = LikedRecipe;