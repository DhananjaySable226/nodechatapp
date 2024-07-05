const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: {
        type: Number,
        required: true
    },
    receiverId: {
        type: Number,
        required: true
    },
    messages: [
        {
            message: {
                type: String,
            },
            msgId: {
                type: Number,
            },
            senderId: {
                type: Number
            },
            receiverId: {
                type: Number
            },
            status: {
                type: Boolean
            },
            time: {
                type: String,
                default: () => new Date().toLocaleString()
            }
        }
    ],
    dateTime: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

module.exports = mongoose.model('chat', chatSchema);