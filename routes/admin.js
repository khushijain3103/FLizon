const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');



//both the routes can have same name as their methods are different

// /admin/add-product => post

router.post('/add-product' , productsController.postAddProduct );

// /admin/add-product => get

router.get('/add-product' , productsController.getAddProduct);

router.get('/products' , productsController.getAdminProducts);

module.exports = router;
