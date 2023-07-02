const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemaValid')
const Schema = mongoose.Schema
const Review = require('./review')


// so that we can manipulate the urls stored in the images array and add a virtual property to it
const ImageSchema = new Schema({
    url: String,
    filename: String
})
// A virtual property that stores images with size = 100 pixels. So that we can access and view them in edit form
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100')
})

const CampGroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
