// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
const {Users} = require('../models/register');
const { Product } = require('../models/product');
const { Cart } = require('../models/cart');
const { Order, Address, Booking } = require('../models/booking');
const { Contact } = require('../models/contact')
const stripe = require('stripe')('sk_test_51IUzDZEDgczo1vXELqjibV6XSAUaFYdU40NuBwL68NcEbUHW682OERQxaewfJpoyP4TZuH62vywBFgq5Td3SvnHz00IxpFKhEm')



// GET endpoint. showing index.ejs file.
router.get('/dashboard', async (req, res) => {
    const userobj = await Users.findById({_id: req.session.userid});
    const products = await Product.find({}).sort({_id: -1}); 
    res.render('./customer/dashboard', {user: userobj, products:products}); // rendering index.ejs file
})

//about page
router.get('/about', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const userData = await Users.findById({ _id: req.session.userid })
    
    return res.render('customer/about',{user: userData});
        // rendering about file
})

// GET endpoint. showing viewproduct.ejs file.
router.get('/viewproduct', async (req, res) => {
     try{
     const userobj = await Users.findById({_id: req.session.userid});
     if (userobj){
        const products = await Product.find({}).sort({_id: -1}); 
        return res.render('./customer/viewproduct', {products:products, user: userobj}); // rendering viewproduct.ejs file
     }
     const products = await Product.find({}).sort({_id: -1}); 
     res.render('./customer/viewproduct', {products:products,}); // rendering viewproduct.ejs file
     }
     catch(err){
        const products = await Product.find({}).sort({_id: -1}); 
        res.render('./customer/viewproduct', {products:products,}); // rendering viewproduct.ejs file
     }
     
})



// GET endpoint. showing cart file.
router.get('/cart', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const cartitems = await Cart.find({ loginID: req.session.userid }).populate('productid');
    const totalPrice = await Cart.find({ loginID: req.session.userid })
    const userobj = await Users.findById({_id: req.session.userid});
    var amount = 0;
    totalPrice.map((obj) => {
        amount = amount + obj.price
    })
    res.render('customer/cart', { cart: cartitems, amount: amount, user:userobj }); // rendering customer/cart.ejs file
})



//post


// Upadating Quantity,from cart
router.post('/updateqty/:id', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const cartItems = await Cart.findById({ _id: req.params.id });
    console.log("old qty", cartItems.quantity)
    const productitems = await Product.findById({ _id: cartItems.productid });
    console.log("old remaining qty", productitems.quantity)
    const updateCartQTY = await Cart.findByIdAndUpdate({ _id: req.params.id }, { quantity: req.body.quantity, price: productitems.price * req.body.quantity });
    if (cartItems.quantity > req.body.quantity) {
        const updateProductQTY = await Product.findByIdAndUpdate({ _id: cartItems.productid }, { quantity: productitems.quantity + (cartItems.quantity - req.body.quantity) })
    } else if (cartItems.quantity < req.body.quantity) {
        const updateProductQTY = await Product.findByIdAndUpdate({ _id: cartItems.productid }, { quantity: productitems.quantity - (req.body.quantity - cartItems.quantity) })
    }
    res.redirect('/customer/cart')
});


//POST Endpoint, Remove from cart
router.get('/deleteproduct/:id', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/')
    }
    const cartItem = await Cart.findById({ _id: req.params.id });
    const deletecart = await Cart.findByIdAndRemove({ _id: req.params.id });
    const productitems = await Product.findById({ _id: cartItem.productid });
    const updateproduct = await Product.findByIdAndUpdate({ _id: cartItem.productid }, { quantity: productitems.quantity + cartItem.quantity })
    res.redirect('/customer/cart')
})

// GET endpoint. showing product details page.
router.get('/detail/:id', async (req, res) => {
    if(!req.session.userid) {
        return res.redirect('/login')
    }
    const userobj = await Users.findById({_id: req.session.userid})
    const product = await Product.findById({ _id: req.params.id })
    res.render('customer/details', {user: userobj, product: product }); // rendering customer/details.ejs file
})


router.get('/addtocart/:id', async (req, res) => {
    // if the user is not logi then it should redirect to /login
    if (!req.session.userid) {
        return res.redirect('/login')
    }
    // otherwise obtain the details of that partcular product id
    const prodDetails = await Product.findById({ _id: req.params.id });
    // chekc whether the product is in cart or not. if it is in cart return with an error
    try {
        const prodincart = await Cart.findOne({ productid: req.params.id, loginID: req.session.userid});
        if (prodincart) {
            return res.redirect('/customer/dashboard')
        }
    } catch (err) {
        return res.redirect('/customer/dashboard')
    }
    // otherwise save the items to the cart
    const productSave = new Cart({
        productid: req.params.id,
        loginID: req.session.userid,
        quantity: Number(req.body.quantity) || 1,
        price: prodDetails.price * Number(req.body.quantity)
    })
    await productSave.save();
    // removing quantity from the Product model
    const getProduct = await Product.findById({ _id: req.params.id });
    const productUpdate = await Product.findByIdAndUpdate({ _id: req.params.id }, { quantity: getProduct.quantity - productSave.quantity })
    res.redirect('/customer/dashboard')
})


// POSt endpoint. addtocart
router.post('/addtocart/:id', async (req, res) => {
    // if the user is not logi then it should redirect to /login
    if (!req.session.userid) {
        return res.redirect('/login')
    }
    // otherwise obtain the details of that partcular product id
    const prodDetails = await Product.findById({ _id: req.params.id });
    // chekc whether the product is in cart or not. if it is in cart return with an error
    try {
        const prodincart = await Cart.findOne({ productid: req.params.id, loginID: req.session.userid});
        if (prodincart) {
            return res.redirect('/customer/dashboard')
        }
    } catch (err) {
        return res.redirect('/customer/dashboard')
    }
    // otherwise save the items to the cart
    const productSave = new Cart({
        productid: req.params.id,
        loginID: req.session.userid,
        quantity: Number(req.body.quantity) || 1,
        price: prodDetails.price * Number(req.body.quantity)
    })
    await productSave.save();
    // removing quantity from the Product model
    const getProduct = await Product.findById({ _id: req.params.id });
    const productUpdate = await Product.findByIdAndUpdate({ _id: req.params.id }, { quantity: getProduct.quantity - productSave.quantity })
    res.redirect('/customer/dashboard')
})


// GET endpoint, go to Chekout page
router.get('/checkout', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const cartDetails =await Cart.find({loginID: req.session.userid});
    let amount = 0;
    cartDetails.map((items) => {
        amount = amount + items.price
    })
    const userData = await Users.findById({ _id: req.session.userid })
    res.render('customer/checkout', { user: userData, amount: amount })
})

// GET endpoint, go to contact us page
router.get('/contact', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const userData = await Users.findById({ _id: req.session.userid })
    res.render('customer/contact', { info: userData.name, user: userData })
})

//post for contact page
router.post('/contact', async (req, res) => {
  
    const contactdata = new Contact({    // adding data to Login model objects
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        
    });
    await contactdata.save(); // saving data to databse
    res.redirect('/customer/contact'); // after saving. redirecting contact page
})


// POST endpoint. to store booking related data
router.post('/checkout', async (req, res) => {
    const cartDetails = await Cart.find({ loginID: req.session.userid }).populate('productid')
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:cartDetails.map((items) => (
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: items.productid.productname,
                        images: ['http://www.adventurewildlife.in/wp-content/uploads/2019/06/571962-plants-1.jpg'],
                    },
                    unit_amount: items.productid.price * 100,
                },
                quantity: items.quantity,
            }
        )),
        mode: 'payment',
        success_url: "http://localhost:3000/customer/success",
        cancel_url: "http://localhost:3000/customer/cancel"
    });
    //oldcode
    var datetime = new Date();
    var date = datetime.getDate() + '/' + datetime.getMonth() + '/' + datetime.getFullYear();
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    
    var totalamount = 0;

    cartDetails.map((data) => {
        totalamount += data.price
    })







    // saving order informartion
    const orderSave = new Order({
        loginID: req.session.userid,
        date: date,
        totalamount: totalamount
    })
    const orderData = await orderSave.save();

    // Saving address information
    const addressSave = new Address({
        orderid: orderData._id,
        loginID: orderData.loginID,
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        city: req.body.city
    })
    const addressData = await addressSave.save();

    // Saving product information
    cartDetails.map(async (data) => {
        const bookSave = new Booking({
            productid: data.productid,
            orderid: orderData._id,
            loginID: orderData.loginID,
            addressid: addressData._id,
            quantity: data.quantity,
            amount: data.price,
            isCancelled: false,
            status: false
        })
        await bookSave.save();
    })

    // Removing items from cart
    const removeCart = await Cart.remove({ loginID: req.session.userid });
    res.json({id: session.id});

    
})



//succes route
router.get('/success', async (req, res) => {
    res.render('customer/success');
})

// error page
router.get('/cancel', async (req, res) => {
    res.render('customer/cancel');
})


// GET endpoint View orders
router.get('/orders', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const userData = await Users.findById({ _id: req.session.userid})
    const orderData = await Order.find({ loginID: req.session.userid }).sort({ _id: '-1' })
    res.render('customer/vieworder', {user:userData, order: orderData })
})

router.get('/details/:id', async (req, res) => {
    const product = await Product.findById({ _id: req.params.id })
    res.render('customer/details', { product: product }); // rendering customer/details.ejs file
})

// Get endpoint, view detailed order
router.get('/order/:id', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const productData = await Booking.find({ orderid: req.params.id }).populate('orderid productid addressid')
    res.render('customer/detailedview', { orderdata: productData })
})


//GET endpoint, cancel order
router.post('/cancel/:id', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const productData = await Booking.findById({ _id: req.params.id })
    const products = await Product.findById({ _id: productData.productid })
    const updateProductbook = await Booking.findByIdAndUpdate({ _id: req.params.id }, { isCancelled: true })
    const updateproductData = await Product.findByIdAndUpdate({ _id: productData.productid }, { quantity: products.quantity + productData.quantity });
    res.redirect(`/customer/order/${productData.orderid}`)
})






module.exports = router; // exporting router, so that we can acces it anywhere in the code.


