const Product = require('../models/product');
const Cart = require('../models/cart');

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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            console.log(cartProducts);
            res.render('shop/cart', {docTitle: 'Your Cart', path: '/cart', products: cartProducts});
        });
    });

  
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('id' , prodId);
    Product.findById(prodId, product => {
        // console.log(product);
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId , product => {
        if(!product) {
            return;
        }
        Cart.deleteProduct(prodId , product.price);
        res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {docTitle: 'Checkout', path: '/checkout'});
};


exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {docTitle: 'Your Orders', path: '/orders'});
};
