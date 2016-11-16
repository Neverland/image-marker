/**
 * Created by enix@foxmail.com on 14-1-8.
 */



exports.all = function (app) {

    const
        path = require('path'),
        config = app.get('_config'),
        imContrl = require(__dirname + '/web/dataAPI/photoAPI').im_marker,
        controller = path.resolve(__dirname + '/web/controller/'),
        passport = require(controller + '/passport/ctr_passport');

    app.locals.date = new Date;

    var auth = exports.auth = function (q) {

        if (!q.session.user || !q.session.user.auth) {
            return false;
        }
        return true;
    };

    exports.get = {
        '/': function (q, s, n) {
            s.render('index', {
                title: config.appName
            });
        },

        '/im': function (q, s, n) {
            if (!auth(q)) {
                s.redirect('passport/login' + (!!q.headers.referer ? '?from=' + q.headers.referer : ''));
            }
            s.render('im/imageMarker', {
                title: config.appName
            });
        },

        '/im/demo.php': function (q, s, n) {
            require(controller + '/im/ctr_im').demo(function (data) {
                if (!data) {
                    s.redirect('/');
                }
                s.render('im/demo', {
                    title: config.appName + '-Demo',
                    data: data,
                    request: q
                });
            });
        },

        '/im/:method/:id': function (q, s, n) {
            q.params && q.params.method && imContrl.call(this, q, s, n);
        },

        '/passport/loginout': function (q, s, n) {

            if (!auth(q)) {
                s.redirect('im/demo.php');
            }
            passport.loginOut(q, function (data) {
                s.render('passport/loginout', data);
            })

        }
    };

    exports.post = {};

    app.route('/passport/reg*')
        .get(function (q, s, n) {
            s.render('passport/reg');
        })
        .post(function (q, s, n) {
            passport.reg(q, function (data) {

                if (data.msg) {
                    s.render('passport/reg', {
                        data: data
                    });
                    return;
                }
                if (data.status == 'succ') {
                    s.redirect(302, '/?email=' + data.email + '&t=' + (+new Date).toString(36));
                    return;
                }
                n();
            })
        });

    app.route('/passport/login')
        .get(function (q, s, n) {

            if (q.query.from) {
                q.session.from = q.query.from;
            }
            s.render('passport/login');

        })
        .post(function (q, s, n) {

            passport.login(q, function (data) {

                if (q.session.from && data.status == 'succ') {
                    s.redirect(q.session.from);
                    delete q.session.from;
                    return;
                }

                s.render('passport/login', {
                    data: data
                });
            })
        })
};
