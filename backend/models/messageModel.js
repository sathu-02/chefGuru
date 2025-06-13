const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'bot']  // Assuming the role can only be 'user' or 'bot'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
