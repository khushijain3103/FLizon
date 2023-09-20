// //sql syntax for creating product model

// // const Sequelize = require('sequelize');

// // const sequelize = require('../utils/database');

// // const Product = sequelize.define('product' , {
// //     id: {
// //         type: Sequelize.INTEGER,
// //         autoIncrement: true,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     title : Sequelize.STRING,
// //     price: {
// //         type: Sequelize.DOUBLE,
// //         allowNull: false
// //     },
// //     imageURL: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// //     description: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //     },
// // });

// // module.exports = Product;


// //mongoDB syntax for creating product model

// const mongodb = require('mongodb');

// const getDb = require('../utils/database').getDb;

// class Product {
//     constructor(title , price , description , imageURL , id , userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageURL = imageURL;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         if(this._id) {
//             return db.collection('products').updateOne({_id: this._id} , {$set: this});
//         }
        
//         return db.collection('products').insertOne(this).then(
//             (result) => {
//                 console.log(result);
//             }
//         ).catch(
//             err => {
//                 console.log(err);
//             }
//         );
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray().then(
//             products => {
//                 return products;
//             }
//         ).catch(
//             err => {
//                 console.log(err);
//             }
//         );
//     }

//     static findById(prodId) {
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}).next().then(
//             product => {
//                 return product;
//             }
//         ).catch(
//             err => {
//                 console.log(err);
//             }
//         );
//     }

//     static deleteById(prodId) {
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)}).then(
//             result => {
//                 console.log('Deleted!');
//             }
//         ).catch(
//             err => {
//                 console.log(err);
//             }
//         );
//     }
// }

// module.exports = Product;

//mongoose syntax for creating product model

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product' , productSchema);