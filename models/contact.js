const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        
    },
    mobile: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true,
        
    },
    message: {
        type: String,
        required: true,
        
    },

});
const ContactSchema = mongoose.model('Contact', contactSchema);
module.exports = { Contact: ContactSchema};