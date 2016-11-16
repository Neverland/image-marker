/**
 * Created by Administrator on 14-3-6.
 */


		var log4js = require('log4js'),
			logger;

		// logger configure
		log4js.configure({
			appenders: [
				{ type: 'console' }, {
					type: 'dateFile',
					filename: './logs/log',
					pattern: "_yyyy-MM-dd",
					maxLogSize: 1024,
					alwaysIncludePattern: false,
					backups: 4,
					category: 'logger'
				}
			],
			replaceConsole: true
		});

			logger = log4js.getLogger('logger');
			logger.setLevel('INFO');

		exports.logger =  logger;
		exports.log4js =  log4js;