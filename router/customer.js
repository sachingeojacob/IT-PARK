// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const {Users} = require('../models/register');


// GET endpoint. showing index.ejs file.
router.get('/dashboard', async (req, res) => {
    const userobj = await Users.findById({_id: req.session.userid});
    res.render('./customer/dashboard', {user: userobj}); // rendering index.ejs file
})


module.exports = router; // exporting router, so that we can acces it anywhere in the code.