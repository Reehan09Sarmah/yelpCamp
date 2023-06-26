const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)


// UserSchema.plugin(passportLocalMongoose)
// add on field for password
// check that usernames are not duplicated
// give additional methods
