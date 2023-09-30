const path = require('path');
require('dotenv').config();

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

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// const db = require('./utils/database');

//used for importing models in sequelize

// const sequelize = require('./utils/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// const mongoConnect = require('./utils/database').mongoConnect;

const User  = require('./models/user');
const store = new MongoDBStore({
    uri: process.env.URI,
    collection: 'sessions'
});


const csrfProtection = csrf();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));   //to serve static files like css, js, images etc

app.use(session(
    {secret : "my secret" , resave: false , saveUninitialized: false , store: store}
))

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    console.log("app");
    res.locals.csrfToken = req.csrfToken();
    console.log("app" , req.csrfToken());   
    next();
});


app.use((req, res, next) => {

    //sql suyntax for creating table

    if(!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
    .then(
        user => {
            if(!user) {
                return next();
            }
            console.log(user);
            req.user = user;
            next();
        }
    )
    .catch(
        err =>{
            next(new Error(err))
        }
        
    );

    // next();

});






const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const pageNotFoundController = require('./controllers/404');

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
app.use(authRoutes);

app.use(pageNotFoundController.pageNotFound);
app.use(pageNotFoundController.get500);

// app.use((error , req , res , next) => {
//     res.status(500).render('500' , {docTitle: 'Error' , path: '/500' , isAuthenticated: req.session.isLoggedIn});
// });

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

// mongoConnect(
//     () => {
//         app.listen(4000 ,() => console.log('Server is running...'));
//     }
// );

mongoose.connect(process.env.URI).then(
    result => {
        // User.findOne().then(
        //     user => {
        //         if(!user) {
        //             const user = new User({
        //                 name: 'Khushi',
        //                 email: 'khushi@test.com',
        //                 cart: {
        //                     items: []
        //                 }
        //             });
        //             user.save();
        //         }
        //     }
        // );

        app.listen(4000 ,() => console.log('Server is running...'));
    }
).catch(
    err => {
        console.log(err);
    }
);

