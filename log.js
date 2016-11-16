/**
 * Created by Administrator on 14-3-6.
 */


var log4js = require('log4js');

exports.all = function (app) {
    log4js.configure({
        appenders: [
            {
                type: 'dateFile',
                filename: 'logs/log',
                pattern: "-yyyy-MM-dd",
                maxLogSize: 1024,
                alwaysIncludePattern: false,
                backups: 3,
                category: 'all'
            }
        ],
        replaceConsole: true
    });

    app.use(
        log4js.connectLogger(
            log4js.getLogger('all'),
            {level: 'auto'}
        )
    );

};

//logger = log4js.getLogger('logger');
//logger.setLevel('INFO');

exports.logger = function (name, level) {

    var logger = log4js.getLogger(name || ' ');

    logger.setLevel(level || 'info');
    return logger;

};

exports.log4js = log4js;
