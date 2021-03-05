const mongoose = require('mongoose'); //mongoose is used to access database

//creating schema i.e fields are used in the database
const categorySchema = mongoose.Schema({

categoryname:{
    type: String,
    unique:true,
    required:true
},


});

const CategorySchema = mongoose.model('Category', categorySchema);//creating model using categorySchema
module.exports = {Category: CategorySchema}//exporting category schema