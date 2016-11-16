/**
 * Created by enix@foxmail.com on 14-1-8.
 */

module.exports = function (app) {

    const secret = process.env.MAIN_KEY || '12345',

        express = app.get('_express'),
        config = app.get('_config'),

        path = require('path'),
        rootURL = path.join(process.cwd()),

        uglify = require('uglifyjs-middleware'),
        log4js = require(__dirname + '/log.js'),
        swig = require(config.engineName),

        captcha = require('captcha'),
        connect = require('connect'),
        mongo = require(rootURL + '/db/mongodb');

    var mw = {
        bodyParser: 'body-parser',
        cookieParser: 'cookie-parser',
        session: 'express-session',
        flash: 'connect-flash',
        csrf: 'csurf',
        timeout: 'connect-timeout',
        compress: 'compression',
        errorHandler: 'errorhandler',
        static: 'serve-static',
        favicon: 'serve-favicon',
        morgan: 'morgan',
        methodOverride: 'method-override',
        mongoStore: function () {
            return require('connect-mongo')(mw.session);
        },
    };

    Object.getOwnPropertyNames(mw).forEach(function (n) {
        var t = mw[n];
        mw[n] = 'function' == typeof(t) ? t() : require(t);
    });


    //package 模板引擎
    !function () {
        app.engine('html', swig.renderFile)
            .set('view engine', 'html')
            .set('views', path.join(__dirname, config.view))
            .set('view cache', false);

        //app.set('view engine', config.engineName);
        swig.setDefaults({cache: false});
    }();

    app.disable('x-powered-by');

    //logs
    process.env.NODE_ENV == 'development' || log4js.all(app);

    app.use(mw.favicon(config.web.icon))
        .use(mw.morgan('dev'))//log
        .use(mw.flash())
        .use(mw.cookieParser(secret))
        .use(mw.bodyParser())
        .use(mw.session({
            store: new mw.mongoStore({
                url: mongo.dbURI,
                db: 'sessions'
            }),
            secret: secret,
            cookie: {maxAge: new Date(Date.now() + (60 * 1000 * 10)), path: '/'}
        }))
        .use(mw.csrf())
        .use(function (q, s, n) {
            s.locals.CSRF = q.csrfToken();
            n();
        })
        .use(mw.timeout(5000))
        .use(captcha({url: '/static/verify.jpg', color: '#000', background: '#fff'}))
        .use(mw.methodOverride())
        .use(mw.compress({level: 6}));


    // development only
    if (process.env.NODE_ENV == 'development') {
        app
            .use(uglify(path.join(__dirname + config.static.src),
                {generateSourceMap: false}
            ))
            .use(mw.errorHandler());
    }

    app.use(mw.static(path.join(__dirname, config.static.src), {maxAge: 31536000, hidden: true}));

};
