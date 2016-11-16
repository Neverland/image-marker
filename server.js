/**
 * Module dependencies.
 */

	var express = require('express'),
		http = require('http'),
		config = require('./config.json'),
		app = express(),
		settings = require(config.settings)(express, app, config),
		router = require(config.router);

	// all environments


	app.get('/', router.all);
	app.get('/im', router.im);

	app.get('/im/:method/:id', router.datAPI);

	//404
	app.use(function (q, s, n) {
		try {
			router.n404.apply(this, arguments);
		}
		catch (e) {}

	});

	//500
	app.use(function (err, q, s, n) {
		try {
			s.send(500, {title: '500: Internal Server Error', error: error});
		}
		catch (e) {}
	});

	exports.server = function (){
		app.listen(process.env.VMC_APP_PORT || 3000, process.env.VCAP_APP_HOST || 'localhost');
	}
