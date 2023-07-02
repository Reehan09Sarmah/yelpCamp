const Campground = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken })
const { cloudinary } = require('../Cloudinary')
const campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id // to save the user id of the logged in user while creating campground
    await campground.save()
    console.log(campground);
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews', // populationg reviews of each camoground
        populate: { // populating authors of each review
            path: 'author'
        }
    }).populate('author') // populating author of each campground 
    if (!campground) {
        //if cannot find the mentioned campground, redirect to campgrounds page and display 'error' flash message
        req.flash('error', 'No Such Campground Present!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    // if try to edit a campground that doesn't exist, display flash message
    if (!campground) {
        req.flash('error', 'No Such Campground Present!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    // using spread operator to copy whats in req.body and pass the object to update
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    // delete if images are selected
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename)
        }
        // pull out those images whose filename is present in the array 'deleteImages' that you receive from the request body
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}
