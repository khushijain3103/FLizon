const express = require('express');

const router = express.Router();

const adminData = require('./admin');

const productsController = require('../controllers/products');


router.get('/' , productsController.getProducts);

module.exports = router;