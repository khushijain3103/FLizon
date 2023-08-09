const express = require('express');

const router = express.Router();
const path = require('path');

const rootDir = require('../utils/path');

const products = [];

//both the routes can have same name as their methods are different

// /admin/add-product => post

router.post('/add-products' , (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/'); // Sends a response
});

// /admin/add-product => get

router.get('/add-products' , (req, res, next) => {
    console.log('In add products middleware!');
    res.sendFile(path.join(rootDir , 'views' , 'add-product.html')) // Sends a response
});

exports.routes = router;
exports.products = products;