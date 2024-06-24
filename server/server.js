const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express()

app.use(
    cors({
        origin: "*",
    })
);

dotenv.config();
app.use(express.json());


const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');
const { Socket } = require("socket.io");

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
io.on("connection", (Socket) => {
    // console.log("Socket.io connection is established");

    Socket.on("setup", (user) => {
        Socket.join(user.data._id);
        // console.log("server:// joined user: ", user.data._id);
        Socket.emit("connected");
    });

    Socket.on("join chat", (room) => {
        Socket.join(room);
        // console.log("user joined room: ", room);
    });

    Socket.on("new message", (newMessageStatus) => {
        var chat = newMessageStatus.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if (user._id == newMessageStatus.sender._id) return;

            Socket.in(user._id).emit("message received", newMessageStatus);
        });
    });
}); 

