const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1];
    // console.log(isLoggedIn);
    
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true'); 

    User.findById('6505d719a60c0590a72b113e').then(
        user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((error) => {
                console.log(error);
                res.redirect('/');
            }
            );
           
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(
        err => {
            console.log(err);
            res.redirect('/');
        }
    );
}