
// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const { Users } = require('../models/register')

// GET endpoint. showing index.ejs file.
router.get('/register', async (req, res) => {
    res.render('register'); // rendering index.ejs file
})

router.get('/login', async (req, res)=> {
    res.render('login');
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
    //res.json( userdata )
})

//login post

router.post('/login', async (req, res) => {
    const usernameExists = await Users.findOne({username: req.body.username}); // finding whether the username exist or not.
    if(usernameExists) {
        if(usernameExists.password == req.body.password) {
            if(usernameExists.roleId == 1) {
                req.session.userid = usernameExists._id;
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/customer/dashboard');
            }
        } else {
            res.render('login', {error: "Incorrect Password!"});
        }
    } else {
        res.render('login', {error: "incorrect Username!"});
    }
    res.render('login'); // rendering login page
})



module.exports = router; // exporting router, so that we can acces it anywhere in the code.