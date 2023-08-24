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

    console.log(imageURL);

    const product = new Product(null , title , imageURL , description , price);
    product.save()
    .then(
        () => {
            res.redirect('/shop/products'); // Sends a response
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
    Product.findById(prodId , product => {
        if(!product) {
            return res.redirect('/');
        }
        let price = product.price;
        price = new Number(price).toFixed(2);
        res.render('admin/edit-product' , {docTitle: 'Edit Product' , path: '/admin/edit-product' , editing: true , product: product , price : price});
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const updatedProduct = new Product(prodId , updatedTitle , updatedImageURL , updatedDescription , updatedPrice);

    updatedProduct.save()
    .then(
        () => {
            res.redirect('/admin/products'); // Sends a response
        }
    )
    .catch(err => console.log(err));

    
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};


exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products' , {prods: products , docTitle: 'Admin Products' , path: '/admin/products'});
    });
};