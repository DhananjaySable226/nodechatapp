const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/db');
const chatRouter = require('./router/chatRouter');
const userRouter = require('./router/userRouter');

const app = express();
app.use(bodyParser.json());
app.use(cors());
connectDB();
app.use('/user', userRouter);
app.use('/chat', chatRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
