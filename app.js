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

const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));   //to serve static files like css, js, images etc

app.use((req, res, next) => {
    User.findByPk(1)
    .then(
        user => {
            req.user = user;
            next();
        }
    )
    .catch(
        err => {
            console.log(err);
        }
    );
});



const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
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

app.use(pageNotFoundController.pageNotFound);

// const server = http.createServer(app);
// server.listen(4000 ,() => console.log('Server is running...'));

// instead of using http.createServer we can use app.listen
//it does both the things for us

Product.belongsTo(User , {constraints: true , onDelete: 'CASCADE'}); //adds a userId column in products table
User.hasMany(Product); //adds a userId column in products table

sequelize
.sync()
.then(   //initialise object present in models folder if they are not already present in database
    result => {
        return User.findByPk(1);
    }
)
.then(
    user => {
        if(!user) {
            return User.create({name: 'Khushi' , email: 'khushi@test.com'});
        }
        return user;
    }
)
.then(
    user => {
        // console.log(user);
        app.listen(3000 ,() => console.log('Server is running...'));
    }
)
.catch(
    err => {
        console.log(err);
    }
);

