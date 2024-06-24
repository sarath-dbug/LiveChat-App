const express = require('express');

const Router = express.Router();
const chatController = require('../controllers/chatController');
const {protect} = require("../middleware/authMiddleware");

Router.post("/", protect, chatController.createChat);
Router.get("/", protect, chatController.fetchChats); 
Router.post("/createGroup", protect, chatController.createGroupChat);
Router.get("/fetchGroups", protect, chatController.fetchGroups);
Router.put("/addNewUserExitedGroup", protect, chatController.addNewUserExitedGroup);

module.exports = Router ;