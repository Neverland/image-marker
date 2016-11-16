/**
 * app env
 */
"use strict";


var express = require('express'),
    app = express(),
    init = require(__dirname + '/init')(express, app),
    config = app.get('_config'),
    router = require(config.router),
    run = function (data, method) {
        var i;
        for (i in data) {
            data.hasOwnProperty(i) && app[method](i, data[i].bind(app));
        }
    },
    apps,
    i;

// all environments
require(config.settings)(app);

router.all(app);


var get = router.get,
    post = router.post;


//request all in one

run(get, 'get');
run(post, 'post');

//404
app.use(function (q, s, n) {
    router.n404.apply(this, arguments);
});

//500
app.use(function (err, q, s, n) {
    s.send('500: Internal Server Error');
    //n(new Error('server error'));
});

var server = exports.server = function () {
    apps = app.listen(process.env.VMC_APP_PORT || 3000, process.env.VCAP_APP_HOST || 'localhost');
};


//启用cluster
require(__dirname + '/util/_cluster')(server);

process.on('SIGTERM', function () {
    apps.close(function () {
        process.exit(0);
    });
});
