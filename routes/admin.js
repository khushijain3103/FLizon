const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');



//both the routes can have same name as their methods are different

// /admin/add-product => post

router.post('/add-product' , isAuth , adminController.postAddProduct );

// /admin/add-product => get

router.get('/add-product' ,isAuth , adminController.getAddProduct);

router.post('/edit-product' , isAuth , adminController.postEditProduct);

router.get('/edit-product/:productId' , isAuth , adminController.getEditProduct);

router.post('/delete-product' , isAuth , adminController.postDeleteProduct);

router.get('/products' ,isAuth , adminController.getAdminProducts);

module.exports = router;
