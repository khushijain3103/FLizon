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
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname , 'public')));   //to serve static files like css, js, images etc

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageNotFoundController = require('./controllers/404');

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

app.listen(4000, () => console.log('Server is running...'));