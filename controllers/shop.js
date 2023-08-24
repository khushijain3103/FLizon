const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(
        ([rows , fieldData]) => {
            res.render('shop/product-list', {
                prods: rows, docTitle: 'All Products', path: '/shop/products'
            });
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId)
    .then(([product]) => {
        console.log(product);
        res.render('shop/product-detail', {product: product[0], docTitle: product[0].title, path: '/shop/products'});
    })
    .catch(err => console.log(err));
 
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(
        ([rows , fieldData]) => {
            res.render('shop/product-list', {
                prods: rows, docTitle: 'Shop', path: '/'
            });
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );
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
