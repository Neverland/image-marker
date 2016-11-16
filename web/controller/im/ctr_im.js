/**
 * Created by Administrator on 2014/4/11.
 */

const
    dataBase = require(process.cwd() + '/db/mysql'),
    md5 = require(process.cwd() + '/util/_md5'),
    secret = process.env.MAIN_KEY || '12345';

dataBase.db('image_marker');

exports.demo = function (cb) {
    dataBase.do('SELECT img, url FROM imgs', function (err, data) {
        if (err) {
            cb(null);
            return false;
        }

        if (Array.isArray(data)) {
            data.forEach(function (a, b) {
                this.splice(b, 1, md5.decrypt(a.url, secret) + '#' + a.img);
            }.bind(data))
        }
        cb(data);
    })
};
