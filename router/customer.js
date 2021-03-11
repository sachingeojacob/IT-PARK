// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const {Users} = require('../models/register');
const { Product } = require('../models/product');


// GET endpoint. showing index.ejs file.
router.get('/dashboard', async (req, res) => {
    const userobj = await Users.findById({_id: req.session.userid});
    const products = await Product.find({}).sort({_id: -1}); 
    res.render('./customer/dashboard', {user: userobj, products:products}); // rendering index.ejs file
})

// GET endpoint. showing viewproduct.ejs file.
router.get('/viewproduct', async (req, res) => {
     //const userobj = await Users.findById({_id: req.session.userid});
     const products = await Product.find({}).sort({_id: -1}); 
    res.render('./customer/viewproduct', {products:products}); // rendering viewproduct.ejs file
})

// GET endpoint. showing cart.ejs file.
router.get('/cart', async (req, res) => {
    res.render('./customer/cart'); // rendering index.ejs file
})

module.exports = router; // exporting router, so that we can acces it anywhere in the code.