const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
    res.render('admin/edit-product' , {docTitle: 'Add Product' , path: '/admin/add-product' , editing: false})
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;

    req.user.createProduct({
        title: title,
        price: price,
        imageURL: imageURL,
        description: description
    })
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
    req.user.getProducts({where: {id: prodId}})
    .then(
        product => {
            if(!product) {
                return res.redirect('/');
            }
            let price = product.price;
            console.log( typeof price);
            res.render('admin/edit-product' , {docTitle: 'Edit Product' , path: '/admin/edit-product' , editing: editMode , product: product});
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


    Product.findByPk(prodId).then(
        product => {
            product.title = updatedTitle;
            product.imageURL = updatedImageURL;
            product.description = updatedDescription;
            product.price = updatedPrice;
            return product.save();
        }
    ).then(
        () => {
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
    Product.findByPk(prodId).then(
        product => {
            return product.destroy();
        }
    ).then(
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

    req.user.getProducts()
    .then(
        products => {
            res.render('admin/products', {
                prods: products, docTitle: 'Admin Products', path: '/admin/products'
            });
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};