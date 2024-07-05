const express = require('express');
const app = express.Router();
const service = require('../service/chatService');

app.post('/create-user/send-msg/:mobile', async (req, res) => {
    try {
        const data = req.body;
        const result = await service.createMSG(data, req.params.mobile);
        res.status(200).json({
            message: "send msg successfully.",
            result: result,
            status: 200
        })
    } catch (err) {
        throw err;
    }
});
app.get('/get/users/chat/:own/:mobile', async (req, res) => {
    try {
        const { own, mobile } = req.params;
        const result = await service.getUserChat(own, mobile);
        res.status(200).json({
            message: "success.",
            result: result,
            status: 200
        });
    } catch (err) {
        throw err;
    }
});
app.get('/getUser/all-info/:mobile/:receiverId', async (req, res) => {
    try {
        const { mobile, receiverId } = req.params;
        const result = await service.getUserAllInfo(mobile, receiverId);
        res.status(200).json({
            message: 'success.',
            result: result
        })
    } catch (err) {
        throw err;
    }
});
app.put('/update/user-status/:mobile/:userId', async (req, res) => {
    try {
        const { mobile, userId } = req.params;
        const result = await service.updateUserStatus(mobile, userId);
        res.status(200).json({
            message: "update successfully.",
            result: result
        })
    } catch (err) {
        throw err;
    }
})

module.exports = app;