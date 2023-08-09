const express = require('express');

const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

const adminData = require('./admin');


router.get('/' , (req, res, next) => {
    console.log('shop.js' , adminData.products);    //adminData.products is an array')
    // res.sendFile(path.join(rootDir , 'views' , 'shops.html')); // Sends a response
    const products = adminData.products;
    res.render('shop' , {prods: products , docTitle: 'Shop' , path: '/'});
});

module.exports = router;