const express = require('express')
const router = express.Router()

const multer = require('multer')
const { storage } = require('../Cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const campgroundCtrl = require('../Controllers/campgroundCtrl')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware') // middlewares

// Chaining methods those who have same routes
router.route('/')
    .get(catchAsync(campgroundCtrl.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgroundCtrl.createCampground)) // Add new Campground

router.get('/new', isLoggedIn, campgroundCtrl.renderNewForm) // New form Page

router.route('/:id')
    .get(catchAsync(campgroundCtrl.showCampground)) // Show Campground
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgroundCtrl.editCampground)) // Update the details
    .delete(isLoggedIn, catchAsync(campgroundCtrl.deleteCampground)) // delete a campground

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundCtrl.renderEditForm)) // Edit page



module.exports = router
