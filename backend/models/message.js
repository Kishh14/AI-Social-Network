const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    recipient: { type: String, required: true },
    text: { type: String, required: true },
    seenBy: { type: [String], default: [] },
    timestamp: { type: Date, default: Date.now },
});

const Message = model('Message', messageSchema);

module.exports = Message;
