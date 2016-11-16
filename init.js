/**
 * Created by enix@foxmail.com on 14-3-14.
 */


module.exports = function (express, app) {
    var rootPath = process.cwd(),
        config = require(rootPath + '/config.json'),
        database = config.database;

    app.set('_express', express);
    app.set('_rootPath', rootPath);
    app.set('_config', config);

    //app.set('_db_mongo',   require(rootPath + database.mongo));
    //app.set('_db_sqlite3', require(rootPath + database.__sql[0]));

};
