const expressAsyncHandler = require('express-async-handler');
const MessageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const ChatModel = require('../models/chatModel');



const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await MessageModel.create(newMessage);

        message = await MessageModel.findById(message._id)
            .populate("sender", "name pic")
            .populate("chat")
            .populate("reciever");
        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name email"
        });
        await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const allMessages = expressAsyncHandler(async (req, res) => {
    const chat_id = req.params.chatId
    try {
        const messages = await MessageModel.find({ chat: chat_id })
            .populate("sender", "name email")
            .populate("reciever")
            .populate("chat");
            res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = {
    sendMessage,
    allMessages
}