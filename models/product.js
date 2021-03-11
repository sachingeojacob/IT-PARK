// Importing necessary packages
const mongoose = require('mongoose'); // Mongoose is used to access db.


// Creating Schema. ie. fields that are used in db.
const productSchema = mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    brandname: {
        type: String,
        require:false
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    warrenty: {
        type: String
    }


});

// Exporting
const ProductSchema = mongoose.model('Product', productSchema); // creating model using ProductSchema
module.exports = { Product: ProductSchema} // Exporting ProductSchema



