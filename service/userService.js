const User = require('../model/userModel');
const chat = require('../model/chatModal');

const app = {
    loginUser: async (data) => {
        try {
            const existingUser = await User.findOne({ mobile: data.mobile });
            if (existingUser) {
                return { message: 'User already exists' };
            }
            const result = await User.create(data);
            return result;
        } catch (err) {
            throw err;
        }
    },
    getUsers: async (mobile, show) => {
        try {
            const data = await User.find({ mobile: { $ne: mobile }, show: show })
                .collation({ locale: 'en', strength: 2 })
                .sort({ name: 1 })
                .lean();
            const result = data.map(item => ({
                ...item,
                name: item.name.charAt(0).toUpperCase() + item.name.slice(1)
            }));
            return result;
        } catch (err) {
            throw err;
        }
    },
    getOneUser: async (mobile) => {
        try {
            const result = await User.findOne({ mobile: mobile });
            return result;
        } catch (err) {
            throw err;
        }
    },
    addUsers: async (data) => {
        try {
            const existingUser = await User.findOne({ mobile: data.mobile });
            if (existingUser) {
                return { message: 'User already exists' };
            }
            const result = await User.create(data);
            return result;
        } catch (err) {
            throw err;
        }
    },
    getUserChatCount: async (mobile, show) => {
        try {
            const currentDate = new Date();
            const users = await User.find({ mobile: { $ne: mobile }, show: show })
                .collation({ locale: 'en', strength: 2 })
                .sort({ name: 1 })
                .lean();
            let sortedUsers = [];
            let totalStatusFalseCount = 0;
            let usersWithFalseStatusCount = 0;
            for (let i = 0; i < users.length; i++) {
                const userMobile = users[i].mobile;
                const capitalizedFirstName = users[i].name.charAt(0).toUpperCase() + users[i].name.slice(1);
                const userDetail = {
                    name: capitalizedFirstName,
                    mobile: userMobile,
                    lastMessageDateTime: null,
                    statusFalseCount: 0
                };
                const chats = await chat.find({
                    $or: [{ senderId: userMobile }, { receiverId: userMobile }],
                    dateTime: { $lte: currentDate }
                })
                    .sort({ dateTime: -1 })
                    .lean();

                let userFalseCount = 0;

                chats.forEach(chat => {
                    chat.messages.forEach(message => {
                        if (message.status === false) {
                            userFalseCount++;
                        }
                    });
                });

                userDetail.statusFalseCount = userFalseCount;
                totalStatusFalseCount += userFalseCount;

                if (userFalseCount > 0) {
                    usersWithFalseStatusCount++;
                }

                if (chats.length > 0) {
                    const lastMessageDateTime = new Date(chats[0].dateTime);
                    userDetail.lastMessageDateTime = lastMessageDateTime;
                }
                sortedUsers.push(userDetail);
            }

            sortedUsers.sort((a, b) => {
                if (a.lastMessageDateTime && b.lastMessageDateTime) {
                    return Math.abs(currentDate - a.lastMessageDateTime) - Math.abs(currentDate - b.lastMessageDateTime);
                } else if (a.lastMessageDateTime) {
                    return -1;
                } else if (b.lastMessageDateTime) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return { sortedUsers, usersWithFalseStatusCount };
        } catch (err) {
            throw err;
        }
    },



    updateUserByMobile: async (mobile, updateData) => {
        try {
            const result = await User.findOneAndUpdate(
                { mobile: mobile },
                updateData,
                { new: true }
            );
            if (!result) {
                throw new Error(`User with mobile number ${mobile} not found or not updated`);
            }
            return result;
        } catch (err) {
            throw err;
        }
    },
    searchUsers: async (searchQuery) => {
        try {
            let aggregationPipeline = [];
            if (typeof searchQuery === 'string') {
                const numericSearchQuery = parseInt(searchQuery);
                aggregationPipeline = [
                    {
                        $match: {
                            $or: [
                                { name: { $regex: searchQuery, $options: 'i' } },
                                { mobile: numericSearchQuery },
                                { userId: numericSearchQuery }
                            ]
                        }
                    }
                ];
            }
            const searchResults = await User.aggregate(aggregationPipeline);
            return searchResults;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = app;
