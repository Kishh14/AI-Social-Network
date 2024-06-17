const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const Message = require('../models/message');
const Notification = require('../models/notifications');

let users = {};
let usernames = {};

const initSocket = (http) => {
    const io = socketIO(http, {
        cors: {
            origin: "*",
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

            // Retrieve message history for the connected user
            const messageHistory = await Message.find({
                $or: [
                    { recipient: username },
                    { name: username }
                ]
            });

            socket.emit('messageHistory', messageHistory);

            // Retrieve and send stored notifications
            try {
                const storedNotifications = await Notification.find({ recipient: username });
                storedNotifications.forEach(notification => {
                    socket.emit('messageResponse', notification.message);
                });

                // Clear stored notifications after sending
                await Notification.deleteMany({ recipient: username });
            } catch (error) {
                console.error(`Error retrieving notifications for ${username}:`, error);
            }
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
            console.log(`Message received: ${message.text} from ${message.name} to ${message.recipient}`);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('messageResponse', message);
            } else {
                // Store notification for offline user
                await Notification.create({ recipient: data.recipient, message });
            }
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

        // Handle follow notifications
        socket.on('followUser', async (data) => {
            const { followerUsername, followedUsername } = data;
            console.log('followUser event received with data:', data); // Debugging log
          
            const followedSocketId = usernames[followedUsername];
            const followerProfile = await User.findOne({ username: followerUsername }).lean();
          
            const notification = {
              id: uuidv4(),
              message: `${followerUsername} has started following you.`,
              follower: {
                id: followerProfile._id,
                username: followerProfile.username,
                profileImg: followerProfile.profileImg
              },
              timestamp: new Date()
            };
          
            console.log('Emitting newFollowerNotification:', notification); // Add log here
          
            if (followedSocketId) {
              io.to(followedSocketId).emit('newFollowerNotification', notification);
            } else {
              // Store notification for offline user
              await Notification.create({ recipient: followedUsername, message: notification });
            }
          });
          
    });
};

module.exports = { initSocket };
