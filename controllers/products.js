const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('admin/add-product' , {docTitle: 'Add Product' , path: '/admin/add-product' , formCSS: true , productCSS: true , activeAddProduct: true})
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/shop/products'); // Sends a response
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list' , {prods: products , docTitle: 'Shop' , path: '/shop/products' , hasProducts: products.length > 0 , activeShop: true , productCSS: true
        });
    });
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products' , {prods: products , docTitle: 'Admin Products' , path: '/admin/products'});
    });
};