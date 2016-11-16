/**
 * Created by enix@foxmail.com on 14-1-24.
 */

var db = require('mongojs'),
    env,
    mongo;


if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES),
        mongo = env['mongodb2-2.4.8'][0]['credentials'];

}
else {
    mongo = {
        "hostname": "localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "name": "",
        "db": "db"
    }
}


var generate_mongo_url = function (obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};

var dbURI = exports.dbURI = generate_mongo_url(mongo);


var db = exports.db = function () {

    return db.connect(dbURI, ['im', 'decword']);

};

exports.find = function (collName, query, data, callback) {

    db.collName.find(query || {}, data || {}, callback);

};

exports.update = function (collName, query, callback) {

    db.collName.findAndModify(query || {}, callback);

};

exports.delete = function (collName, query, callback) {
    // query 不做处理 {} 会删掉所有, 交由上层控制

    db.decword.remove(query, callback);

};
