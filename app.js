const path = require('path');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname , 'public')));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname , 'views' , '404.html'));
});

// const server = http.createServer(app);
// server.listen(4000 ,() => console.log('Server is running...'));

// instead of using http.createServer we can use app.listen
//it does both the things for us

app.listen(4000, () => console.log('Server is running...'));