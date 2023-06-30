const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemaValid')
const Schema = mongoose.Schema
const Review = require('./review')

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//to handle --- delete the reviews associated with it also when a camp is deleted. Otherwise it will stay in reviews db
CampGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } }) //delete those reviews with id that are present in the 'reviews' array of camp
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema)
