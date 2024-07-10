const express = require('express');

const Router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require("../middleware/authMiddleware");
const upload = require('../config/multer');

Router.post('/login', userController.loginController);
Router.post('/register', userController.registerController);
Router.post('/upload',upload.single('file'),userController.imageUpload);
Router.post('/editUserProfile',userController.editProfile);
Router.get('/fetchUserProfile', protect, userController.userProfile);
Router.get('/fetchUsers', protect, userController.fetchAllUsersController);

module.exports = Router;