const Product = require('../models/product');



exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, docTitle: 'All Products', path: '/shop/products', hasProducts: products.length > 0, activeShop: true, productCSS: true
        });
    });
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true
        });
    });
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {docTitle: 'Your Cart', path: '/cart'});
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {docTitle: 'Checkout', path: '/checkout'});
};
