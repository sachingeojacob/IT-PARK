// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const multer = require('multer');
const { Category } = require('../models/category');
const{Product} = require('../models/product')



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
    res.render('./admin/addproduct'); // rendering index.ejs file
})

//GET the viewproduct page in the admin
router.get('/viewproduct', async (req, res)=>{
    res.render('./admin/viewproduct')
})

//GET the category page in the admin
router.get('/category', async (req, res)=>{
    res.render('./admin/category')
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











// POST endpoint. saving product data to database.
router.post('/addproduct', uploadPhoto, async (req, res) => {
    // if(!req.session.userid) {
    //     return res.redirect('/login');
    //}
    const productdata = new Product({    // adding data to Login model objects
        productname: req.body.productname,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.filename
    });
    await productdata.save(); // saving data to databse
    //res.redirect('/admin/addproduct'); // after saving. redirecting add product page
    res.json( productdata )
})




module.exports = router; // exporting router, so that we can acces it anywhere in the code.