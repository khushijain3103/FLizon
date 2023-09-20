const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'aniya.oberbrunner@ethereal.email',
        pass: '865fTdM2p6kMryje5M'
    }
});

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
                    return transporter.sendMail({
                        to: email,
                        from: '<shop@flizon.com>',
                        subject: 'Signup succeeded',
                        html: '<h1>You successfully signed up</h1>'
                    });
                }
            );
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        docTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err)
        {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');

        User.findOne({email: req.body.email}).then(
            user => {
                if(!user) {
                    req.flash('error', 'No account with that email found');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }
        ).then(
            result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: '',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password</p>
                    `
                });
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
    });
};

exports.getNewPassword = (req, res, next) => {
    console.log('get new password');
    const token = req.params.token;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(
        user => {
            let message = req.flash('error');
            if(message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
        
            res.render('auth/new-password', {
                path: '/new-password',
                docTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};

exports.postNewPassword = (req, res, next) => {
    console.log('post new password');
    const password = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId}).then(
        user => {
            resetUser = user;
            return bcrypt.hash(password, 12);
        }
    ).then(
        hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }
    ).then(
        result => {
            res.redirect('/login');
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
};
