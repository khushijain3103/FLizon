const Product = require('../models/product');
const mongodb = require('mongodb');

const fileHelper = require('../utils/file');

const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('admin/edit-product',
        {
            docTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: false,
            errorMessage: null,
            validationErrors: [],
            product: { title: '', imageURL: '', description: '', price: '' }

        })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    console.log(req.body);
    console.log(image);

    if(!image) {

        return res.status(422)
        .render('admin/edit-product'
            , {
                docTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: { title: title , description: description, price: price },
                errorMessage: "Attached file is not an image",
                validationErrors: []
            });
        }


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("add", errors.array());
        return res.status(422)
            .render('admin/edit-product'
                , {
                    docTitle: 'Add Product',
                    path: '/admin/add-product',
                    editing: false,
                    hasError: true,
                    product: { title: title , description: description, price: price },
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()
                });
    }

    const imageURL = image.path;

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
        .catch(err => {
           
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
                
        });


};

exports.getEditProduct = (req, res, next) => {

    let editMode = req.query.edit;

    if (editMode === "false") {
        return res.redirect('/');
    }

    editMode = true;

    const prodId = req.params.productId;

    console.log('product id ', prodId);

    Product.findById(prodId)
        .then(
            product => {
                if (!product) {
                    return res.redirect('/');
                }
                res.render('admin/edit-product',
                    {
                        docTitle: 'Edit Product',
                        path: '/admin/edit-product',
                        editing: editMode,
                        product: product,
                        hasError: false,
                        errorMessage: null,
                        validationErrors: [],

                    });
            }
        )
        .catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        );
};

exports.postEditProduct = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImage = req.file;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("edit", errors.array());
        return res.status(422)
            .render('admin/edit-product'
                , {
                    docTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: true,
                    hasError: true,
                    product: { title: updatedTitle,  description: updatedDescription, price: updatedPrice, _id: prodId },
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array()
                });
    }

    Product.findById(prodId).then(
        product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (updatedImage) {
                fileHelper.deleteFile(product.imageURL);
            }
            product.imageURL = updatedImage ? updatedImage.path : product.imageURL;
            return product.save().then(
                () => {
                    console.log('updated product');
                    res.redirect('/admin/products'); // Sends a response
                }
            )
        }
    ).catch(
        err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
            
            
        }
    );

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);

    Product.findById(prodId).then(
        product => {
            if (!product) {
                return next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageURL);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        }
    ).then(
        () => {
            console.log('deleted product');
            res.redirect('/admin/products'); // Sends a response
        }
    ).catch(
        err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
            
            
        }
    );

};


exports.getAdminProducts = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     res.render('admin/products' , {prods: products , docTitle: 'Admin Products' , path: '/admin/products'});
    // });

    Product.find({ userId: req.user._id })
        .then(
            products => {
                res.render('admin/products', {
                    prods: products, docTitle: 'Admin Products', path: '/admin/products', isAuthenticated: req.session.isLoggedIn
                });
            }
        ).catch(
            err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
                
                
            }
        );
};