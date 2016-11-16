/**
 * Created by Administrator on 2014/4/18.
 */

var mysql = require(process.cwd() + '/db/mysql'),
    Lockit = require('lockit'),
    lockit;


mysql.db('image_marker');

exports.init = function (app) {

    var lockit = new Lockit(app, {

        db: mysql.uri,
        dbCollection: 'users',
        appname: '图片标注',
        url: '/im/',
        signup: {
            route: '/signup',
            tokenExpiration: '1 day',
            views: {
                signup: '',         // input fields 'name', 'email' and 'password' | local variable 'error' | POST /'signup.route'
                linkExpired: '',    // message link has expired | input field 'email' | POST /'signup.route'/resend-verification
                verified: '',       // message email is now verified and maybe link to /'login.route'
                signedUp: '',       // message email has been sent => check your inbox
                resend: ''          // input field 'email' | local variable 'error' | POST /'signup.route'/resend-verification
            },
            handleResponse: true  // let lockit handle the response after signup success
        },
        login: {
            route: '/login',
            logoutRoute: '/logout',
            views: {
                login: '',          // input fields 'login' and 'password' | POST /'login.route' | local variable 'error'
                loggedOut: ''       // message that user logged out
            },
            handleResponse: true  // let lockit handle the response after login/logout success
        },
        forgotPassword: {
            route: '/forgot-password',
            tokenExpiration: '1 day',
            views: {
                forgotPassword: '', // input field 'email' | POST /'forgotPassword.route' | local variable 'error'
                newPassword: '',    // input field 'password' | POST /'forgotPassword.route'/#{token} | local variable 'error'
                changedPassword: '',// message that password has been changed successfully
                linkExpired: '',    // message that link has expired and maybe link to /'forgotPassword.route'
                sentEmail: ''       // message that email with token has been sent
            }
        },
        deleteAccount: {
            route: '/delete-account',
            views: {
                remove: '',         // input fields 'name', 'phrase', 'password' | POST /'deleteAccount.route' | local variable 'error'
                removed: ''         // message that account has been deleted
            },
            handleResponse: true  // let lockit handle the response after delete account success
        },
        failedLoginsWarning: 3,
        failedLoginAttempts: 5,
        accountLockedTime: '20 minutes',
        emailSignup: {
            subject: 'Welcome to {{ appname }}',
            text: [
                '<h2>Hello {{ username }}</h2>',
                'Welcome to {{ appname }}.',
                '<p>{{ link }} to complete your registration.</p>'
            ].join(''),
            linkText: 'Click here'
        },
        emailSignupTaken: {
            subject: 'Email already registered',
            text: [
                '<h2>Hello {{ username }}</h2>',
                'you or someone else tried to sign up for {{ appname }}.',
                '<p>Your email is already registered and you cannot sign up twice.',
                ' If you haven\'t tried to sign up, you can safely ignore this email. Everything is fine!</p>',
                '<p>The {{ appname }} Team</p>'
            ].join('')
        },
        emailResendVerification: {
            subject: 'Complete your registration',
            text: [
                '<h2>Hello {{ username }}</h2>',
                'here is the link again. {{ link }} to complete your registration.',
                '<p>The {{ appname }} Team</p>'
            ].join(''),
            linkText: 'Click here'
        },
        emailForgotPassword: {
            subject: 'Reset your password',
            text: [
                '<h2>Hey {{ username }}</h2>',
                '{{ link }} to reset your password.',
                '<p>The {{ appname }} Team</p>'
            ].join(''),
            linkText: 'Click here'
        }
    });
};

// exports.signup = function () {
//
//     lockit.on('signup', function (user, res) {
//         console.log('a new user signed up');
//
//         // set signup.handleResponse to 'false' for this to work
//         res.send('Welcome!');
//     });
// };
//
// exports.signup = function () {
//
//     lockit.on('logout', function (user, res) {
//
//     });
//
// };
//
// exports.delete = function () {
//
//     lockit.on('delete', function (user, res) {
//
//     });
//
// };
