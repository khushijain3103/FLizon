const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const { check } = require('express-validator');



//both the routes can have same name as their methods are different

// /admin/add-product => post

router.post('/add-product', isAuth,
    [
        check("title", "title should be alphanumeric with minimum 3 characters")
            .isAlphanumeric().isLength({ min: 3 }).trim(),
            // check("imageURL", "imageURL should be a valid URL").isURL(),
        check("price", "price should be a number").isFloat(),
        check("description", "description should be  with minimum 5 characters")
            .isLength({ min: 5, max: 400 }).trim()
    ], adminController.postAddProduct);

// /admin/add-product => get

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/edit-product', isAuth,
[
    check("title", "title should be alphanumeric with minimum 3 characters")
        .isAlphanumeric().isLength({ min: 3 }).trim(),
        // check("imageURL", "imageURL should be a valid URL").isURL(),
    check("price", "price should be a number").isFloat(),
    check("description", "description should be  with minimum 5 characters")
        .isLength({ min: 5, max: 400 }).trim()
],
 adminController.postEditProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/products', isAuth, adminController.getAdminProducts);

module.exports = router;
