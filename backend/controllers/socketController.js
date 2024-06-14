const { createRequire } = require('module');
// const require = createRequire(import.meta.url);
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Message = require("../models/message");

let users = {};
let usernames = {};

const initSocket = (http) => {
    const io = socketIO(http, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', async (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on('userConnected', async (username) => {
            users[socket.id] = username;
            usernames[username] = socket.id;

            await User.updateOne({ username }, { $set: { online: true } }, { upsert: true });

            const userList = await User.find({}, 'username online').lean();
            io.emit('userList', userList);

            const messageHistory = await Message.find({ recipient: username });
            socket.emit('messageHistory', messageHistory);
        });

        socket.on('message', async (data) => {
            const senderSocketId = socket.id;
            const senderUsername = users[senderSocketId];
            const recipientSocketId = usernames[data.recipient];

            // Fetch sender's profile information from the database
            const senderProfile = await User.findOne({ username: senderUsername }).lean();

            const message = {
                ...data,
                id: uuidv4(),
                name: senderUsername,
                profileImg: senderProfile.profileImg,
                email: senderProfile.email,
                seenBy: [],
                timestamp: new Date()
            };

            // Save the message to the database
            await Message.create(message);
            console.log(`Message received: ${message.text} from ${message.name} to ${message.recipient} anddsddd ${message.email}`);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('messageResponse', message);
            }
            socket.emit('messageResponse', message);
        });

        socket.on('typing', (data) => {
            const recipientSocketId = usernames[data.recipient];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typingResponse', data);
            }
        });

        socket.on('disconnect', async () => {
            console.log('🔥: A user disconnected');
            const username = users[socket.id];
            if (username) {
                // Update user's online status in the database
                await User.updateOne({ username }, { $set: { online: false } });
                delete users[socket.id];
                delete usernames[username];

                // Emit updated user list
                const userList = await User.find({}, 'username online').lean();
                io.emit('userList', userList);
            }
        });
    });
};

module.exports = { initSocket };
