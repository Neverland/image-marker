/**
 * Created by enix@foxmail.com on 14-2-20.
 */

var rootURL = process.cwd(),
    secret = process.env.MAIN_KEY || '12345',
    md5 = require(rootURL + '/util/_md5'),

    pointlink = require(rootURL + '/web/dataAPI/im/sql/pointlink'),
    decword = require(rootURL + '/web/dataAPI/im/sql/decword'),

    // 启用sqllite
    // dataBase = require(rootURL + '/db/sqlite');
    // dataBase.db(rootURL + '/data/image_marker.db');

    // 启用mysql
    dataBase = require(rootURL + '/db/mysql');
dataBase.db('image_marker');


exports.im_marker = function (q, s, next) {
    var query = q.query,
        type = q.params.method,
        method = q.params.id,
        md5Str,

        im_marker_ctrl = function (type, method) {

            var name = ['pointlink', 'decword'];

            if (name.indexOf(type) > -1 && eval(type).hasOwnProperty(method)) {

                try {
                    eval(type + '["' + method + '"]')(q, s, md5Str, dataBase)
                } catch (e) {
                    //console.log(name.indexOf(type)>-1 , eval(type).hasOwnProperty(method))
                    next(new Error('Database error'));
                }
                return false;
            }
            next();

            // 可行
            // 闭包的威力能够访问作用域里面的所有变量，如dataBase.可以执行他的方法，很危险。
            // try {
            //     CTRL = eval(type).hasOwnProperty(method);
            // }
            // catch (e) {
            //     return next();
            // }

            CTRL ? eval(type + '["' + method + '"]')(q, s, md5Str, dataBase) : next();

        };

    // if(!query || !query.image || !q.params.id ) {
    //
    //     return false;
    //  }

    if (!query || !q.params.id || (!query.image && !query.id)) {
        next();
        return false;
    }


    md5Str = md5.md5(query.image + secret);
    // md5Str = md5.encrypt(query.image, secret);

    im_marker_ctrl(type, encodeURIComponent(method));


    // 未整合前
    // if (type == 'decword' && decword.hasOwnProperty(method)) {
    //     try {
    //         decword[method](q, s, md5Str, dataBase);
    //     } catch (e) {
    //         next(new Error('Database error'));
    //     }
    // } else {
    //     next();
    // }
    //
    //
    // if (type == 'pointlink' && pointlink.hasOwnProperty(method)) {
    //     try {
    //         pointlink[method](q, s, md5Str, dataBase);
    //     } catch (e) {
    //         next(new Error('Database error'));
    //     }
    // } else {
    //     next();
    // }

};
