const express = require('express');
const router = express.Router();
const service = require('../service/userService');

router.post('/loginUser', async (req, res) => {
    try {
        const data = req.body;
        const result = await service.loginUser(data)
        res.status(200).json({
            message: "success",
            result: result
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/getUsers/:mobile/:show', async (req, res) => {
    try {
        const mobile = req.params.mobile;
        const show = req.params.show;
        const result = await service.getUsers(mobile, show);
        res.status(200).json({
            message: "data get successfull.",
            status: 200,
            result: result
        })
    } catch (err) {
        throw err;
    }
});
router.get('/getOneUser/:mobile', async (req, res) => {
    try {
        const mobile = req.params.mobile;
        const result = await service.getOneUser(mobile);
        res.status(200).json({
            message: "data get successfull.",
            status: 200,
            result: result
        })
    } catch (err) {
        throw err;
    }
});
router.post('/addUsers', async (req, res) => {
    try {
        const data = req.body;
        const result = await service.addUsers(data);
        res.status(200).json({
            message: "data save successfully",
            result: result,
            status: 200
        })
    } catch (err) {
        throw err;
    }
})
router.get('/getUserChatCount/:mobile/:show', async (req, res) => {
    try {
        const mobile = req.params.mobile;
        const show = req.params.show === 'true';
        const result = await service.getUserChatCount(mobile, show);

        const sortedUsers = result.sortedUsers;
        const usersWithFalseStatusCount = result.usersWithFalseStatusCount;

        res.status(200).json({
            message: "Data fetched successfully.",
            status: 200,
            sortedUsers: sortedUsers,
            usersWithFalseStatusCount: usersWithFalseStatusCount
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred.",
            status: 500,
            error: err.message
        });
    }
});
router.put('/update-user/:mobile', async (req, res) => {
    try {
        const { mobile } = req.params;
        const updateData = req.body;
        const result = await service.updateUserByMobile(mobile, updateData);
        res.status(200).json({
            message: "success",
            result: result
        })
    } catch (err) {
        throw err;
    }
});
router.get('/serarch/users', async (req, res) => {
    try {
        const { searchQuery } = req.query;
        const result = await service.searchUsers(searchQuery);
        res.status(200).json({
            message: "success.",
            result: result
        })
    } catch (err) {
        throw err;
    }
})

module.exports = router;
