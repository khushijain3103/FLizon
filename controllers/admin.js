const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('admin/edit-product' , {docTitle: 'Add Product' , path: '/admin/add-product' , editing: false})
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageURL: imageURL,
        userId: req.user
    });

    product.save()
    .then(
        () => {
            res.redirect('/'); // Sends a response
        }
    )
    .catch(err => console.log(err));

    
};

exports.getEditProduct = (req, res, next) => {
   
    let editMode =  req.query.edit;

    if(editMode === "false") {
        return res.redirect('/');
    }

    editMode = true;

    const prodId = req.params.productId;

    console.log( 'product id ' , prodId);

    Product.findById(prodId)
    .then(
        product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product' , {docTitle: 'Edit Product' , path: '/admin/edit-product' , editing: editMode , product: product , isAuthenticated: req.session.isLoggedIn});
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );
};

exports.postEditProduct = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product.findById(prodId).then(
        product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageURL = updatedImageURL;
            return product.save();
        }
    ).then(
        () => {
            console.log('updated product');
            res.redirect('/admin/products'); // Sends a response
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
    
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);

    Product.findByIdAndRemove(prodId)
    .then(
        () => {
            res.redirect('/admin/products'); // Sends a response
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};


exports.getAdminProducts = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     res.render('admin/products' , {prods: products , docTitle: 'Admin Products' , path: '/admin/products'});
    // });

    Product.find()
    .then(
        products => {
            res.render('admin/products', {
                prods: products, docTitle: 'Admin Products', path: '/admin/products' , isAuthenticated: req.session.isLoggedIn
            });
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};