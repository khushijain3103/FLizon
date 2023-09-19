// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Order = sequelize.define('order' , {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     }
// });

// module.exports = Order;

//mongoose method of creating order model

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {type: Object , required: true},
            quantity: {type: Number , required: true}
        }
    ],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User' //ref is used to tell mongoose that this is a reference to the user model
        }
    }
});

module.exports = mongoose.model('Order' , orderSchema);
