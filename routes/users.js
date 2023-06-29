const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const userctrl = require('../Controllers/userCtrl')
const passport = require('passport')
const User = require('../models/user')
const { storeReturnTo } = require('../middleware');


router.route('/register')
    .get(userctrl.RegisterForm) // user register form
    .post(catchAsync(userctrl.registerUser)) // register the user

router.route('/login')
    .get(userctrl.loginForm) // login form
    .post(storeReturnTo, passport.authenticate('local', {
        failureFlash: true, failureRedirect: '/login'
    }), userctrl.loginUser) // user log in

router.get('/logout', userctrl.logout) // logout


module.exports = router
