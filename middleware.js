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
