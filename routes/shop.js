const express = require('express');

const router = express.Router();

const adminData = require('./admin');

const productsController = require('../controllers/products');

router.get('/' , );

router.get('/products' , productsController.getProducts);

router.get('/cart' ,);

router.get('/checkout' ,);

module.exports = router;