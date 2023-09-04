const Product = require('../models/product');
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

    Product.fetchAll().then(
        products => {
            res.render('shop/product-list', {
                prods: products, docTitle: 'All Products', path: '/shop/products'
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
        res.render('shop/product-detail', {product: product, docTitle: product.title, path: '/shop/products'});
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

    Product.fetchAll().then(
        products => {
            res.render('shop/index', {
                prods: products, docTitle: 'Shop', path: '/'
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

    req.user.getCart().then(
        cart => {
            return cart.getProducts().then(
                products => {
                    res.render('shop/cart', {docTitle: 'Your Cart', path: '/cart', products: products});
                }
            ).catch(
                err => {
                    console.log(err);
                }
            );
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
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

    req.user.getCart().then(
        cart => {
            return cart.getProducts({where: {id: prodId}});
        }
    ).then(
        products => {
            const product = products[0];
            if(!product) {
                return;
            }
            const newQuantity = product.cartItem.quantity - 1;
            if(newQuantity > 0) {
                return product.cartItem.update({quantity: newQuantity});
            }
            return product.cartItem.destroy();
        }
    ).then(
        result => {
            res.redirect('/cart');
        }
    ).catch(
        err => {
            console.log(err);
        }
    );


};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include : ['products']}).then(   
        orders => {
            console.log(orders);
            res.render('shop/orders', {docTitle: 'Your Orders', path: '/orders', orders: orders});
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;

    req.user.getCart().then(
        cart => {
            fetchedCart = cart;
            return cart.getProducts();
        }
    ).then(
        products => {
            return req.user.createOrder().then(
                order => {
                    return order.addProducts(
                        products.map(
                            product => {
                                product.orderItem = {quantity: product.cartItem.quantity};
                                return product;
                            }
                        )
                    );
                }
            ).catch(
                err => {
                    console.log(err);
                }
            );
        }
    ).then(
        result => {
            return fetchedCart.setProducts(null);
        }
    )
    .then(
        result => {
            res.redirect('/orders');
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );
};
