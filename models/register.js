// Importing necessary packages
const mongoose = require('mongoose'); // Mongoose is used to access db.


// Creating Schema. ie. fields that are used in db.
const userSchema = mongoose.Schema({
    fname: {
        type: String,
        unique: true,
        required: true
    },
    lname: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    roleId: {
        type: Number,
        required: true
    }

});

// Exporting
const UserSchema = mongoose.model('Users', userSchema); // creating model using loginSchema
module.exports = { Users: UserSchema} // Exporting LoginSchema