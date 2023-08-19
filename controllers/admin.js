const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('admin/add-product' , {docTitle: 'Add Product' , path: '/admin/add-product' , formCSS: true , productCSS: true , activeAddProduct: true})
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products' , {prods: products , docTitle: 'Admin Products' , path: '/admin/products'});
    });
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/shop/products'); // Sends a response
};