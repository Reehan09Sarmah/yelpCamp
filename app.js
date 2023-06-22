const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')

//import the routers
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

//connect to mongo dB
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database Connected!")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // to disguise methods like put or patch with post as post is allowed in form method
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    //below 2 are to remove deprecation warnings
    resave: false,
    saveUninitialized: true,
    //More options
    cookie: {
        httpOnly: true,//so that client-side script cannot access the cookie(if browser supports)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//session xpires by the week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
//middleware to make flash message available to files in views
app.use((req, res, next) => {
    //the flash message is accessible to local files under the key 'success'
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//import the router here and use it
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)







//for handling routes that doesn't exist
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No! Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000');

})
