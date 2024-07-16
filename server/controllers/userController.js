const express = require('express');
const UserModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const generateToken = require("../config/generateToken");
const { validateFields } = require("../utils/validators");


//Login
const loginController = expressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const user = await UserModel.findOne({ name })

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid Username or Password');
    }
});



//Register
const registerController = expressAsyncHandler(async (req, res) => {

    const { name, email, password, mobile, googleSign } = req.body;

    if (googleSign) {

        // Check if the user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            //craete an entry in the DB
            const user = await UserModel.create({ name, email, password, mobile });
            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                });
            } else {
                res.status(404);
                throw new Error('Registration Error')
            }
            res.status(201).json({ message: 'User created successfully' });
        }

    } else {
        try {
            // Validate input fields
            validateFields({ name, email, password, mobile });

            // Check if the user already exists
            const userEmailExist = await UserModel.findOne({ email });
            if (userEmailExist) {
                res.status(409).json({ message: 'User with this email ID already exists' });
                return;
            }

            // Check if the username is already taken
            const userNameExist = await UserModel.findOne({ name });
            if (userNameExist) {
                res.status(409).json({ message: 'Username already taken, please choose another one' });
                return;
            }

            //craete an entry in the DB
            const user = await UserModel.create({ name, email, password, mobile });
            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                });
            } else {
                res.status(404);
                throw new Error('Registration Error')
            }

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
        }
    }
});



const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        }
        : {};

    const users = await UserModel.find(keyword).find({
        _id: { $ne: req.user._id },
    });
    res.send(users);
});



const imageUpload = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!req.file || !userId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        const filePath = req.file.filename;
        const upload = await UserModel.findByIdAndUpdate(userId, { image: filePath }, { new: true });
        res.json(upload);
    } catch (error) {
        res.status(400);
        console.error('Error updating user:', error);
        throw new Error(error.message);
    }
});



const userProfile = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



const editProfile = expressAsyncHandler(async (req, res) => {
    try {
        const { name, email, mobile, userId } = req.body;
        // Check for all fields
        if (!name || !email || !mobile) {
            res.send(404);
            throw Error('All necessery input fields have not been filled');
        }

        // Update user profile
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { name, email, mobile } },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error('Failed to update user profile')
        }

        res.status(201).send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


const fetchChatuser = expressAsyncHandler(async (req, res) => {
    const { chat_userId } = req.params;

    try {
        const chatUser = await UserModel.findById(chat_userId);
        if (!chatUser) {
            res.status(404);
            throw new Error('Chat user not found');
        }
        res.json(chatUser);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = {
    loginController,
    registerController,
    fetchAllUsersController,
    imageUpload,
    userProfile,
    editProfile,
    fetchChatuser
}