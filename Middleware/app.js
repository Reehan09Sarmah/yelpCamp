const express = require('express')
const app = express()
const morgan = require('morgan')

//app.use(morgan('common')) // to run some code on every single request

//Our own middleware function
app.use((req, res, next) => {
    // req.method = 'GET' in eyes of express its a GET request
    req.requestTime = Date.now() //setting the request time
    console.log(req.method, req.path);
    next();
})

//middleware to run if request made to '/dogs'
app.use('/dogs', (req, res, next) => {
    console.log("I love dogs!");
    next()
})

//authentication- protecting routes using middleware (NOT MAIN AUTHENTICATION)
// a middleware named verifyPassword
const verifyPassword = (req, res, next) => {
    const { password } = req.query
    if (password === 'kellogs') {
        next()
    }
    res.send('SORRY YOU NEED A PASSWORD')
}
// //create a middlewareof our own and chain 2 of them using next() call
// app.use((req, res, next) => {
//     console.log("First Middleware!");
//     next(); //next() means whatever valid middleware or route handler comes next will run
// })

// app.use((req, res, next) => {
//     console.log("Second Middleware!");
//     next();
// })

app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send('Home Page!')
})

app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`);
    res.send('Woof!')
})

//so we have defined a middleware function named 'verifyPassword' to protect a route 
//by checking password from query string of '/secret' eg:"/secret?password=kellogs" we pass this middleware as an 
//argument to app.get of that specific route we want to put security on
app.get('/secret', verifyPassword, (req, res) => {
    res.send("I am a Cereal Killer! I love Cereals!!")
})

//if nothing else - no routes was matched
app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})


app.listen(3000, () => {
    console.log("LISTENING ON PORT: 3000");
})
