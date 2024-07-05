const chat = require('../model/chatModal');
const user = require('../model/userModel');

const app = {
    createMSG: async (data, mobile) => {
        try {
            const { senderId, receiverId, message, status } = data;
            let userDoc = await user.findOne({ mobile: mobile });
            let userFound = await user.findOne({ mobile: senderId });
            if (!userFound) {
                userFound = await user.create({
                    name: '',
                    mobile: senderId,
                    show: true,
                    dateTime: () => new Date().toLocaleString()
                });
            }
            if (!userDoc) {
                throw new Error(`User with mobile number ${senderId} not found`);
            }
            if (!userDoc.show) {
                userDoc.show = true;
                await userDoc.save();
            }
            let chatDoc = await chat.findOne({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            });
            if (chatDoc) {
                const msgId = chatDoc.messages.length + 1;
                chatDoc.messages.push({ message, msgId, senderId, receiverId, status });
                chatDoc.dateTime = new Date().toISOString(); // Update dateTime to the current time in ISO format
                await chatDoc.save();
            } else {
                chatDoc = new chat({
                    senderId,
                    receiverId,
                    messages: [{ message, msgId: 1, senderId, receiverId, status }],
                    dateTime: new Date().toISOString()
                });
                await chatDoc.save();
            }
            return chatDoc;
        } catch (err) {
            throw err;
        }
    },
    getUserChat: async (own, mobile) => {
        try {
            const chatDocs = await chat.find({
                $or: [
                    { senderId: own, receiverId: mobile },
                    { senderId: mobile, receiverId: own }
                ]
            });
            if (chatDocs.length > 0) {
                for (let chatDoc of chatDocs) {
                    let updated = false;
                    for (let message of chatDoc.messages) {
                        if (message.status === false) {
                            message.status = true;
                            updated = true;
                        }
                    }
                    if (updated) {
                        await chatDoc.save();
                    }
                }
            }
            return chatDocs;
        } catch (err) {
            throw err;
        }
    },
    getUserAllInfo: async (mobile, receiverId) => {
        try {
            const result = await user.find({ mobile: receiverId });
            const names = result.map(user => capitalizeFirstLetter(user.name));
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            const data = await chat.find({
                $or: [
                    { mobile, receiverId },
                    { senderId: mobile, receiverId: receiverId }
                ]
            });
            const dateTime = data.map(item => item.dateTime);
            const data1 = {
                name: names,
                dateTime
            };
            return data1;
        } catch (err) {
            throw err;
        }
    },
    updateUserStatus: async (mobile, receiverId) => {
        try {
            const result = await chat.updateMany(
                {
                    $or: [
                        { senderId: mobile, receiverId: receiverId },
                        { senderId: receiverId, receiverId: mobile }
                    ]
                },
                { $set: { 'messages.$[elem].status': true } },
                { arrayFilters: [{ 'elem.status': { $ne: true } }] }
            );
            if (!result.acknowledged) {
                throw new Error('Update operation was not acknowledged.');
            }

            return result;
        } catch (err) {
            throw err;
        }
    },
}

module.exports = app;