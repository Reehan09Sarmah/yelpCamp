const { ExpressError } = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemaValid')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl // store the original url to return to back to the page that redirected you to login
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

// to store the url in locals from session so that after log in, users can be redirected to that
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; // store the url in the locals as session gets cleared after every log in
    }
    next();
}

//using joi to validate things -- this is a middleware using Joi -- sets some restriction on the data being put through forms
module.exports.validateCampground = (req, res, next) => {
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

// middleware to check if logged in user is the author of the campground they are trying of edit
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    // check if logged in user has the permission to edit --> even by sending ajax request
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    // check if logged in user has the permission to edit --> even by sending ajax request
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)

    }
    else {
        next();
    }
}
