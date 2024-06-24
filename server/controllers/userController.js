const express = require('express');
const UserModel = require('../models/userModel')
const expressAsyncHandler = require('express-async-handler')
const generateToken = require("../config/generateToken")



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

    const { name, email, password } = req.body;

    //check for all fields
    if (!name || !email || !password) {
        res.send(404);
        throw Error('All necessery input fields have not been filled');
    }

    //pre-existing user
    const userEmailExist = await UserModel.findOne({ email });
    if (userEmailExist) {
        res.send(405);
        throw new Error('User already Exist');
    }

    //userName already taken
    const userNamelExist = await UserModel.findOne({ name });
    if (userNamelExist) {
        res.send(406);
        throw new Error('UserName already taken');
    }

    //craete an entry in the DB
    const user = await UserModel.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(404);
        throw new Error('Registration Error')
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


module.exports = {
    loginController,
    registerController,
    fetchAllUsersController
}