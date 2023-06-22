const express = require('express')
const router = express.Router({ mergeParams: true })
//mergeParams is required as the :id part is in app.js and 
//we need to access it here too
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemaValid')


//using joi to validate things -- this is a middleware using Joi -- sets some restriction on the data being put through forms
//then use this middleware in the route handlers


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = errror.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)

    }
    else {
        next();
    }
}




router.post('/', validateReview, catchAsync(async (req, res) => {

    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

//to delete reviews
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    // $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //delete the reference of the review from the reviews array
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted the review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
