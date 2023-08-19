const Product = require('../models/product');



exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, docTitle: 'All Products', path: '/shop/products', hasProducts: products.length > 0, activeShop: true, productCSS: true
        });
    });
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {product: product, docTitle: product.title, path: '/shop/products'});
    });
 
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


exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {docTitle: 'Your Orders', path: '/orders'});
};
