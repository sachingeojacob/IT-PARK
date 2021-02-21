// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.


// GET endpoint. showing index.ejs file.
router.get('/', async (req, res) => {
    res.render('customer/dashboard'); // rendering index.ejs file
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