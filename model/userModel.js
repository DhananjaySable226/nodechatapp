const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        require: true,
        unique: true
    },
    show: {
        type: Boolean,
        require: true
    },
    dateTime: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});
userSchema.pre('save', async function (next) {
    if (!this.userId) {
        this.userId = await generateUniqueUserId();
    }
    next();
});
async function generateUniqueUserId() {
    let userId;
    let existingUser;
    do {
        userId = await Math.floor(1000000000 + Math.random() * 9000000000);
        existingUser = await User.findOne({ userId });
    } while (existingUser);
    return userId;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
