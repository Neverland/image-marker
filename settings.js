/**
 * Created by enix@foxmail.com on 14-1-8.
 */
	module.exports = function(express, app, config) {
		var path = require('path'),
			uglify = require('uglifyjs-middleware'),
			log4js = require('./log.js');


		app.set('views', path.join(__dirname, config.view));
		app.set('view engine', config.engineName);

		app.use(express.favicon(config.web.icon))
			.use(express.logger('dev'))
			.use(express.json())
			.use(express.urlencoded())
			.use(express.methodOverride())
			.use(express.compress({level:6}));

		//use router
		app.use(app.router);

		//static

		// development only
		if ('development' == app.get('env')) {
			app.use(express.errorHandler());
			app.use(uglify(path.join(__dirname + '/static'),
				{generateSourceMap: false }
			));
		}

		app.use(express.static(path.join(__dirname, '/static')), {maxAge: 31557600000, hidden:true});


		//logs
		app.use(log4js.log4js.connectLogger(log4js.logger, { level: log4js.log4js.levels.INFO }))


	}
