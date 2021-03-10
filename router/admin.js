// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const multer = require('multer');
const { Category } = require('../models/category');
const{ Product } = require('../models/product');
const { Staff } = require('../models/staff');
const { Users } = require('../models/register')


// Configuring multer or middleware of multer.
// Creating multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        const filename = file.originalname.split('.')[0];
        callback(null, `product-${filename}-${Date.now()}.${ext}`)
    }
});
// Creating upload handler.
const upload = multer({
    storage: multerStorage,
    dest: 'public/uploads'
});
// creating multer middleware.
const uploadPhoto = upload.single('image');


// GET endpoint. showing index.ejs file.
router.get('/dashboard', async (req, res) => {
    res.render('./admin/dashboard'); // rendering index.ejs file
})


//GET the addproduct page in the admin
router.get('/addproduct', async (req, res) => {
    const category = await Category.find({})
    res.render('./admin/addproduct', { category:category }); // rendering index.ejs file
})

//GET the viewproduct page in the admin
router.get('/viewproduct', async (req, res)=>{
    res.render('./admin/viewproduct')
})

//GET the category page in the admin
router.get('/category', async (req, res)=>{
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const categorys = await Category.find({}).sort({_id: -1});
    res.render('./admin/category', {category: categorys})
})

//GET the addstaff page in the admin
router.get('/addstaff', async (req, res)=>{
    res.render('./admin/addstaff')
})

//GET the view user page in the admin
router.get('/viewuser', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const users = await Users.find({}).sort({_id: -1});
    res.render('admin/viewuser', {users: users}); // rendering admin/view user.ejs file
})

//GET the addstaff page in the admin
router.get('/viewstaff', async (req, res)=>{
    if(!req.session.userid) {
        return res.redirect('/login');
    }
    const staffs = await Staff.find({}).sort({_id: -1});
    res.render('./admin/viewstaff', {staff: staffs}); //rendering admin/view staff.ejs file
})








//post endpoint. saving staff data to database
router.post('/addstaff', async (req, res) => {
    // console.log(req.body.category);
    // const stafExists = await Staff.findOne({email: req.body.email}); // finding whether the email exist or not.
    // if(stafExists) {
    //    return res.render('admin/dashboard', {error: "staff already exists!"});
    // }
    const staffdata = new Staff({    // adding data to Staff model objects
        firstname: req.body.fname,
        lastname: req.body.lname,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.gender,
        zipcode: req.body.zipcode,
        district: req.body.district,
        state: req.body.state,  
    });
    await staffdata.save(); // saving data to databse
    res.render('admin/dashboard'); // after saving. rendering caregory page
    //res.json( staffdata )
})


// POST endpoint. saving product data to database.
router.post('/addproduct', uploadPhoto, async (req, res) => {
    // if(!req.session.userid) {
    //     return res.redirect('/login');
    //}
    const productdata = new Product({    // adding data to Login model objects
        productname: req.body.productname,
        brandname: req.body.brandname,
        color: req.body.color,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        image: req.file.filename,
        description: req.body.description,
        warrenty: req.body.warrenty
    });
    await productdata.save(); // saving data to databse
    res.redirect('/admin/addproduct'); // after saving. redirecting add product page
    //res.json( productdata )
})



// POST endpoint. saving category data to database.
router.post('/category', async (req, res) => {
    console.log(req.body.category);
    const categorExists = await Category.findOne({categoryname: req.body.category}); // finding whether the username exist or not.
    if(categorExists) {
        return res.render('admin/category', {error: "Category already exists!"});
    }
    const categorydata = new Category({    // adding data to category model objects
        categoryname: req.body.category,
    });
    await categorydata.save(); // saving data to databse
    res.render('admin/dashboard'); // after saving. rendering caregory page
    //res.json( userdata )
})



module.exports = router; // exporting router, so that we can acces it anywhere in the code.