const express = require("express");
const path = require('path');
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userModel = require("../server/models/userModel")

const app = express()

app.use(
    cors({
        origin: "*",
    })
);

dotenv.config();


// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');
const { socket } = require("socket.io");


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log('Server is Connected to DB');
    } catch (error) {
        console.log('Server is NOT Connected to DB', error);
    }
};
connectDB();


app.get('/', (req, res) => {
    res.send("API fetching")
})

app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 4040
const server = app.listen(PORT, () => console.log(`Server Running at http://localhost:${PORT}`));


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
    pingTimeout: 60000,
});


// Socket.io connection process
io.on("connection", (socket) => {
    socket.on("setup", async (user) => {
        // Update user's online status to true
        await userModel.findByIdAndUpdate(user.data._id, { is_online: true });

        // Store user ID in the socket instance
        socket.userId = user.data._id;

        socket.join(user.data._id);
        socket.emit("connected");
    });

    socket.on("disconnect", async () => {
        if (socket.userId) {
            // Update user's online status to false
            await userModel.findByIdAndUpdate(socket.userId, { is_online: false });
        }
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageStatus) => {
        var chat = newMessageStatus.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if (user._id == newMessageStatus.sender._id) return;

            socket.in(user._id).emit("message received", newMessageStatus);
        });
    });
});


