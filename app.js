const path = require('path');

const express = require('express');
const app = express();

// const expressHbs = require('express-handlebars');

// app.engine('hbs', expressHbs.engine({
//     extname: "hbs",
//     defaultLayout:"main-layout",
//     layoutsDir: "views/layouts/"
//   }));

app.set('view engine' , 'ejs');
app.set('views' , 'views');

const bodyParser = require('body-parser');

// const db = require('./utils/database');

//used for importing models in sequelize

// const sequelize = require('./utils/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const mongoConnect = require('./utils/database').mongoConnect;

const User  = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));   //to serve static files like css, js, images etc

app.use((req, res, next) => {

    //sql suyntax for creating table

    User.findById("64f63440f5f61b518263428a")
    .then(
        user => {
            console.log(user);
            req.user = new User(user.name , user.email , user.cart , user._id);
            next();
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );

    // next();

});



const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const pageNotFoundController = require('./controllers/404');

// db.execute('SELECT * FROM products')
// .then(
//     (result) => {
//         console.log(result[0] , result[1]);
//     }
// )
// .catch(
//     (err) => {
//         console.log(err);
//     }
// );

// app.use((req, res, next) => {
//     console.log('In the middleware!');
//     next(); // Allows the request to continue to the next middleware in line
// });

// app.use('/' , (req, res, next) => {
//     console.log('In another middleware!');
//     next(); // Allows the request to continue to the next middleware in line
// });

//This route in string means that it will b executed for routes starting with /products
//due to which we added /products above the / route

app.use('/admin' , adminRoutes);
app.use(shopRoutes);

// app.use(pageNotFoundController.pageNotFound);

// const server = http.createServer(app);
// server.listen(4000 ,() => console.log('Server is running...'));

// instead of using http.createServer we can use app.listen
//it does both the things for us

//sql syntax for creating table

// Product.belongsTo(User , {constraints: true , onDelete: 'CASCADE'}); //adds a userId column in products table
// User.hasMany(Product); //adds a userId column in products table
// User.hasOne(Cart); //adds a userId column in cart table
// Cart.belongsTo(User); //adds a userId column in cart table
// Cart.belongsToMany(Product , {through: CartItem}); //adds a cartId column in products table
// Product.belongsToMany(Cart , {through: CartItem}); //adds a productId column in cart table
// Order.belongsTo(User); //adds a userId column in orders table
// User.hasMany(Order); //adds a userId column in orders table
// Order.belongsToMany(Product , {through: OrderItem}); //adds a orderId column in products table

// sequelize
// .sync() 
// .then(   //initialise object present in models folder if they are not already present in database
//     result => {
//         return User.findByPk(1)
//     }
// )
// .then(
//     user => {
//         if(!user) {
//             return User.create({name: 'Khushi' , email: 'khushi@test.com'});
//         }
//         return user;
//     }
// )
// .then(
//     user => {
//         // console.log(user);
//         return user.createCart();
//     }
// )
// .then(
//     cart => {
//         app.listen(4000 ,() => console.log('Server is running...'));
//     }
// )
// .catch(
//     err => {
//         console.log(err);
//     }
// );


//mongodb syntax for creating table

mongoConnect(
    () => {
        app.listen(4000 ,() => console.log('Server is running...'));
    }
);

