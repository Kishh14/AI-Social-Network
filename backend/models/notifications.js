const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Assuming IMessage is a defined schema or an interface elsewhere
// const IMessage = require('../interfaces/message'); // Uncomment and modify this line according to your project structure

const notificationSchema = new Schema({
    recipient: { type: String, required: true },
    message: { type: Schema.Types.Mixed, required: true }, // Use Schema.Types.Mixed for flexibility
});

const Notification = model('Notification', notificationSchema);

module.exports = Notification;
