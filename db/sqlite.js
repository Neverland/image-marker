/**
 * Created by enix@foxmail.com on 14-3-13.
 */

var sqlite3 = require('sqlite3').verbose();

exports.db = function (table) {

    var db = new sqlite3.Database(table);

    exports.do = function (sql, callback) {

        db.all(sql, callback)

    };
    return db;
};

// e.g
// var sql = "insert into points values(4,'abc','123,122,184,122','1234','http://www.baidu.com','adf33923ffdd3ddfdf','" + (+new Date) + "')";
//
// db.run(sql, function (err, data) {
//     if (err) {
//         console.log(err, 1)
//         return;
//     }
//     console.log(err, 2)
//
// });
//
// 查询所有数据
// db.all('select * from points', function (err, data) {
//     console.log(err, data);
//
// });
