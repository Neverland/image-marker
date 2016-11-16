/**
 * Created by enix@foxmail.com on 14-3-24.
 */

const mysql = require('mysql');

function MySql(table) {
    var env,
        meta,
        VCAP;

    if (process.env.VCAP_SERVICES) {
        VCAP = JSON.parse(process.env.VCAP_SERVICES),
            meta = VCAP['mysql-5.1'][0]['credentials'];

        env = {
            host: meta.host,
            port: meta.port,
            user: meta.user,
            password: meta.password,
            database: meta.name
        }
    } else {
        env = {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '2212',
            database: table
        }
    }

    this.env = env;
    this.uri = 'mysql://' + env.user + ':' + env.password + '@' + env.host + ':' + env.port + '/' + env.database;


}

exports.db = function (table) {

    var env = new MySql(table),
        pool = mysql.createPool(env.env);

    exports.do = function (sql, callback) {

        this.getConnection(function (err, connection) {

            connection.query(sql, function () {
                callback.apply(connection, arguments);
                connection.release();
            });

        })
    }.bind(pool)

};

/*
exports.db = function (table) {
    var env,
        meta,
        VCAP,
        pool;

    if (process.env.VCAP_SERVICES) {
        VCAP = JSON.parse(process.env.VCAP_SERVICES),
            meta = VCAP['mysql-5.1'][0]['credentials'];

        env = {
            host: meta.host,
            port: meta.port,
            user: meta.user,
            password: meta.password,
            database: meta.name
        }
    } else {
        env = {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '2212',
            database: table
        }
    }


    pool = mysql.createPool(env);

    exports.uri = 'mysql://' + env.host + ':' + env.port + '/' + env.database + '?user=' + env.user + '&password=' + env.password;

    exports.uri = 'mysql://' + env.user + ':' + env.password + '@' + env.host + ':' + env.port + '/' + env.database;


    exports.do = function (sql, callback) {

        this.getConnection(function (err, connection) {
            console.log(connection.query);
            connection.query(sql, function () {
                callback.apply(connection, arguments);
                connection.release();
            });

        })
    }.bind(pool)

};


//db = mysql.createConnection(env);
//db.connect();

exports.do = function (sql, callback) {

    db.query(sql, callback);

};
*/
