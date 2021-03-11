// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const {Product} = require('../models/product')


// GET endpoint. showing index.ejs file.
router.get('/', async (req, res) => {
    const products = await Product.find({}).sort({_id: -1}); 
    return res.render('customer/dashboard', {products:products});
        // rendering index.ejs file
})

// logout
router.get('/logout', async (req,res) => {
    if(req.session.userid) {
        req.session.destroy(() => {
            res.redirect('/');
        })
    }
})

module.exports = router; // exporting router, so that we can acces it anywhere in the code.