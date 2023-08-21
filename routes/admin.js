const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');



//both the routes can have same name as their methods are different

// /admin/add-product => post

router.post('/add-product' , adminController.postAddProduct );

// /admin/add-product => get

router.get('/add-product' , adminController.getAddProduct);

router.post('/edit-product' , adminController.postEditProduct);

router.get('/edit-product/:productId' , adminController.getEditProduct);


router.get('/products' , adminController.getAdminProducts);

module.exports = router;
