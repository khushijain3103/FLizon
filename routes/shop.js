const express = require('express');

const router = express.Router();

const adminData = require('./admin');

const shopController = require('../controllers/shop');

router.get('/' , shopController.getIndex );

router.get('/shop/products' , shopController.getProducts);

router.get('/cart' , shopController.getCart);

router.get('/checkout' , shopController.getCheckout);

router.get('/orders' , shopController.getOrders);

module.exports = router;