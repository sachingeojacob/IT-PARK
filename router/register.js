// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const { Users } = require('../models/register')

// GET endpoint. showing index.ejs file.
router.get('/', async (req, res) => {
    res.render('register'); // rendering index.ejs file
})


// POST endpoint. saving registration data to database.
router.post('/register', async (req, res) => {
    const usernamExists = await Users.findOne({username: req.body.username}); // finding whether the username exist or not.
    if(usernamExists) {
        return res.render('register', {error: "Username already exists!"});
    }
    const userdata = new Users({    // adding data to Login model objects
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        mobileno: req.body.mobileno,
        roleId: 2,
    });
    await userdata.save(); // saving data to databse
    res.render('index'); // after saving. rendering login page
})



module.exports = router; // exporting router, so that we can acces it anywhere in the code.