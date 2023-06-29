const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const User = require('../models/user')
const { storeReturnTo } = require('../middleware');
// get registration page
router.get('/register', (req, res) => {
    res.render('users/register')
})

// register the user to dB
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })


    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

// get login page
router.get('/login', (req, res) => {
    res.render('users/login')
})

// make the user log in
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl);
});

//whenever this route will get called, user will logout immediately
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
})


module.exports = router
