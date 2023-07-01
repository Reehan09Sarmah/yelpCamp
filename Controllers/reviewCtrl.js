const Campground = require('../models/campground')
const Review = require('../models/review')


module.exports.postReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Your review was posted')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    // $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //delete the reference of the review from the reviews array
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted the review')
    res.redirect(`/campgrounds/${id}`)
}
