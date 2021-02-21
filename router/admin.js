// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.


// GET endpoint. showing index.ejs file.
router.get('/dashboard', async (req, res) => {
    res.render('./admin/dashboard'); // rendering index.ejs file
})


module.exports = router; // exporting router, so that we can acces it anywhere in the code.