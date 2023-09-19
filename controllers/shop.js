const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    // Product.fetchAll()
    // .then(
    //     ([rows , fieldData]) => {
    //         res.render('shop/product-list', {
    //             prods: rows, docTitle: 'All Products', path: '/shop/products'
    //         });
    //     }
    // )
    // .catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

    Product.find().then(
        products => {
            res.render('shop/product-list', {
                prods: products, docTitle: 'All Products', path: '/products' , isAuthenticated: req.session.isLoggedIn
            });
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId)
        .then((product) => {
            console.log(product);
            res.render('shop/product-detail', { product: product, docTitle: product.title, path: '/shop/products' , isAuthenticated: req.session.isLoggedIn });
        })
        .catch(err => console.log(err));

};

exports.getIndex = (req, res, next) => {
    // Product.fetchAll()
    // .then(
    //     ([rows , fieldData]) => {
    //         res.render('shop/product-list', {
    //             prods: rows, docTitle: 'Shop', path: '/'
    //         });
    //     }
    // )
    // .catch(
    //     err => {
    //         console.log(err);
    //     }
    // );
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response

    Product.find().then(
        products => {
            res.render('shop/index', {
                prods: products, docTitle: 'Shop', path: '/', isAuthenticated: req.session.isLoggedIn
            });
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

};

exports.getCart = (req, res, next) => {
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for(product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if(cartProductData) {
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         console.log(cartProducts);
    //         res.render('shop/cart', {docTitle: 'Your Cart', path: '/cart', products: cartProducts});
    //     });
    // });

    console.log(req.user.cart.items);

    req.user
        .populate("cart.items.productId") //populate does not return a promise so we use execPopulate
        .then(
            user => {
                const products = user.cart.items;
                console.log(user);
                res.render('shop/cart', { docTitle: 'Your Cart', path: '/cart', products: products , isAuthenticated: req.session.isLoggedIn });
            }
        ).catch(
            err => {
                console.log(err);
            }
        );

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(
        product => {
            return req.user.addToCart(product);
        }
    ).then(
        result => {
            console.log(result);
            res.redirect('/cart');
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user
    //   .getCart()
    //   .then(cart => {
    //     fetchedCart = cart;
    //     return cart.getProducts({ where: { id: prodId } });
    //   })
    //   .then(products => {
    //     let product;
    //     if (products.length > 0) {
    //       product = products[0];
    //     }

    //     if (product) {
    //       const oldQuantity = product.cartItem.quantity;
    //       newQuantity = oldQuantity + 1;
    //       return product;
    //     }
    //     return Product.findByPk(prodId);
    //   })
    //   .then(product => {
    //     return fetchedCart.addProduct(product, {
    //       through: { quantity: newQuantity }
    //     });
    //   })
    //   .then(() => {
    //     res.redirect('/cart');
    //   })
    //   .catch(err => console.log(err));
};



exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.findById(prodId , product => {
    //     if(!product) {
    //         return;
    //     }
    //     Cart.deleteProduct(prodId , product.price);
    //     res.redirect('/cart');
    // });

    req.user.deleteItemFromCart(prodId).then(
        () => {
            res.redirect('/cart');
        }
    ).catch(
        err => {
            console.log(err);
        }
    );


};

exports.getOrders = (req, res, next) => {
    // req.user.getOrders({include : ['products']}).then(   
    //     orders => {
    //         console.log(orders);
    //         res.render('shop/orders', {docTitle: 'Your Orders', path: '/orders', orders: orders});
    //     }
    // ).catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

    // req.user.getOrders().then(
    //     orders => {
    //         console.log(orders);
    //         res.render('shop/orders', { docTitle: 'Your Orders', path: '/orders', orders: orders });
    //     }
    // ).catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

    Order.find({ "user.userId": req.user._id }).then(
        orders => {
            res.render('shop/orders', { docTitle: 'Your Orders', path: '/orders', orders: orders  , isAuthenticated: req.session.isLoggedIn});
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
    

};

exports.postOrder = (req, res, next) => {
    // let fetchedCart;

    // req.user.getCart().then(
    //     cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts();
    //     }
    // ).then(
    //     products => {
    //         return req.user.createOrder().then(
    //             order => {
    //                 return order.addProducts(
    //                     products.map(
    //                         product => {
    //                             product.orderItem = {quantity: product.cartItem.quantity};
    //                             return product;
    //                         }
    //                     )
    //                 );
    //             }
    //         ).catch(
    //             err => {
    //                 console.log(err);
    //             }
    //         );
    //     }
    // ).then(
    //     result => {
    //         return fetchedCart.setProducts(null);
    //     }
    // )
    // .then(
    //     result => {
    //         res.redirect('/orders');
    //     }
    // )
    // .catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

    req.user
        .populate("cart.items.productId") //populate does not return a promise so we use execPopulate
        .then(
            user => {
                const products = user.cart.items.map(i => {
                    return { quantity: i.quantity, product: { ...i.productId._doc } };
                }
                );
                console.log(products);
                const order = new Order({
                    user: {
                        email: req.user.email,
                        userId: req.user
                    },
                    products: products
                });
                return order.save();
            }
        ).then(
            result => {
                return req.user.clearCart();
            }
        ).then(
            () => {
                res.redirect('/orders');
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
};
