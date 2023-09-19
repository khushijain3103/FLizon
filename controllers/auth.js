const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1];
    // console.log(isLoggedIn);

    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true'); 

    // User.findById('6505d719a60c0590a72b113e').then(
    //     user => {
    //         req.session.isLoggedIn = true;
    //         req.session.user = user;
    //         req.session.save((error) => {
    //             console.log(error);
    //             res.redirect('/');
    //         }
    //         );
           
    //     }
    // ).catch(
    //     err => {
    //         console.log(err);
    //     }
    // );

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}).then(
        user => {
            if(!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }

            bcrypt.compare(password, user.password).then(
                doMatch => {
                    if(doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((error) => {
                            console.log(error);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password');
                    res.redirect('/login');
                }
            ).catch(
                err => {
                    console.log(err);
                    res.redirect('/login');
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
    // console.log(csrfToken);
    req.session.destroy(
        err => {
            console.log(err);
            res.redirect('/');
        }
    );
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        docTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email}).then(
        userDoc => {
            if(userDoc) {
                req.flash('error', 'Email already exists');
                return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
            .then(
                hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                }
            )
            .then(
                result => {
                    res.redirect('/login');
                }
            );
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};