const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('add-product' , {docTitle: 'Add Product' , path: '/admin/add-product' , formCSS: true , productCSS: true , activeAddProduct: true})
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/'); // Sends a response
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop' , {prods: products , docTitle: 'Shop' , path: '/' , hasProducts: products.length > 0 , activeShop: true , productCSS: true
        });
    });

    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
    
};