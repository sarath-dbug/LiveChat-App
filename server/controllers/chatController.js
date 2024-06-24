const { json } = require('express');
const ChatModel = require('../models/chatModel');
const UserModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');


const createChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserID params Not send with request");
        return res.sendStatus(400);
    }

    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createdChat = await ChatModel.create(chatData);
            const fullChat = await ChatModel.findOne({ _id: createdChat._id })
                .populate("users", "-password");
            res.status(200).json(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
      console.log("Fetch Chats aPI : ", req);
      ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await UserModel.populate(results, {
            path: "latestMessage.sender",
            select: "name email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message); 
    }
  });

const createGroupChat = expressAsyncHandler(async (req, res) => {
    const {groupName, userId} = req.body;
    
    if (!groupName || !userId) {
        return res.status(400).send({ message: "Data is insufficient" });
    }

    try {
        const groupChat = await ChatModel.create({
            chatName: groupName,
            isGroupChat: true,
            users: [userId],
            groupAdmin: userId
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const fetchGroups = expressAsyncHandler(async (req, res) => {
    try {
        const allGroups = await ChatModel.where("isGroupChat").equals(true);
        res.status(200).send(allGroups);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});



const addNewUserExitedGroup = expressAsyncHandler(async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return res.status(400).json({ message: 'Group ID and User ID are required' });
  }

  try {
    const group = await ChatModel.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.users.includes(userId)) {
      return res.status(400);
    }

    group.users.push(userId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = addNewUserExitedGroup;


module.exports = {
    createChat,
    fetchChats,
    createGroupChat,
    fetchGroups,
    addNewUserExitedGroup
}

