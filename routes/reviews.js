const express = require('express')
const router = express.Router({ mergeParams: true })//mergeParams is required as the :id part is in app.js and we need it here
const catchAsync = require('../utils/catchAsync')
const reviewCtrl = require('../Controllers/reviewCtrl')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtrl.postReview)) // post review

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewCtrl.deleteReview)) // delete review

module.exports = router
