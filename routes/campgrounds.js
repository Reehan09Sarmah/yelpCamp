const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemaValid')
const { isLoggedIn } = require('../middleware')

//using joi to validate things -- this is a middleware using Joi -- sets some restriction on the data being put through forms
//then use this middleware in the route handlers
//Error handling middleware
const validateCampground = (req, res, next) => {
    //importing campgroundSchema function which uses joi to validate form data before submission

    const { error } = campgroundSchema.validate(req.body) // to validate body data received from forms
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next() // if no error then move to required route handling middlewares
    }

}

//export the router and use it in the app.js file. 
//The route specified there will be prefixed to the routes used here
//For eg: we are using --- app.use('/campgrounds', campgrounds)
//The /campgrounds will get prefixed to the other routes here


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//to get the page to add new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

//to add the new campground to DB
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id // to save the user id of the logged in user while creating campground
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//to get the details of the campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews').populate('author')
    if (!campground) {
        //if cannot find the mentioned campground, redirect to campgrounds page and display 'error' flash message
        req.flash('error', 'No Such Campground Present!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

//to get the edit page
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    //if try to edit a campground that doesn't exist, display flash message
    if (!campground) {
        req.flash('error', 'No Such Campground Present!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

//to edit the campground details
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params                                 //using spread operator to copy whats in req.body and pass the object to update
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    req.flash('success', 'Successfully Updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//to delete a campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

module.exports = router
