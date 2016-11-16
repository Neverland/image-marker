/**
 * Created by Administrator on 2014/4/21.
 */


const mysql = require(process.cwd() + '/db/mysql'),
    URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
    NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    PHONE_REGEXP = /^[1][358]\d{9}$/i,
    PASSWORD_REGEXP = /^([0-9a-zA-Z\_`!~@#$%^*+=,.?;'":)(}{/\\\|<>&\[\-]|\])+$/i,
    USERNAME_REGEXP = /^[a-zA-Z0-9_]{4,12}$/i,
    md5 = require(process.cwd() + '/util/_md5'),
    r = require(process.cwd() + '/web/dataAPI/response');


mysql.db('image_marker');

exports.login = function (q, fn) {

    var body = q.body,
        email = body.email,
        ps = body.password;

    if (!email || !ps) {
        return fn({
            msg: '请输入必填项',
            status: 'fail',
            d: 4
        })
    }

    if (body.verify != q.session.captcha) {
        return fn({
            msg: '验证码错误',
            status: 'fail',
            d: 3
        })
    }

    q.session.failTime || (q.session.failTime = 0);

    mysql.do('SELECT email, password, t3 FROM users WHERE email="' + body.email.trim() + '"', function (err, data) {

        var message = {},
            user;

        if (err || data.length == 0) {
            return fn({
                msg: '用户不存在',
                status: 'fail',
                d: 2
            })
        }

        data = data[0];

        if (+new Date < data.t3 || +new Date < data.t3) {
            return fn({
                msg: '用户锁定中',
                status: 'fail',
                d: 0
            })
        }

        if (!(md5.md5(ps.trim()) == data.password)) {

            q.session.failTime++;

            if (q.session.failTime < 3) {
                return fn({msg: '密码错误', status: 'succ', d: 3});
            } else {
                mysql.do('UPDATE users SET `t3`="' + (+new Date + 3600000) + '", `t2`="' + (+new Date) + '" WHERE email ="' + data.email + '"', function (err, data) {
                });
                return fn({msg: '密码输入错误3次，账号被锁定6小时！', status: 'succ', d: 1})
            }
        }

        mysql.do('UPDATE users SET `t2`="' + (+new Date) + '" , `ip`="' + q.ip + '", `t3`="' + 0 + '" WHERE email ="' + data.email + '"', function (err, data) {
        });

        q.session.user = {auth: true, email: data.email, password: data.password};

        return fn({msg: '登陆成功', status: 'succ'});
    })

};

exports.loginOut = function (q, fn) {

    fn = 'function' == typeof(fn) ? fn : function () {
    };

    var user = q.session.user;

    if (q.sessionStore) {
        q.session.destroy(function () {
            fn(user);
        });
    } else {
        q.session = null;
        fn(user);
    }
};

exports.reg = function (q, fn) {

    var body = q.body,
        session = q.session,
        fn = typeof(fn) === 'function' ? fn : function () {
        },
        d = r.escapeData([body.email, body.password]);

    if (!body.email || !body.password || !body.repass) {
        return fn({
            msg: '请输入必填项',
            status: 'fail',
            d: d
        })
    } else if (!EMAIL_REGEXP.test(body.email)) {
        return fn({
            msg: 'email格式错误',
            status: 'fail',
            d: d
        })
    } else if (!PASSWORD_REGEXP.test(body.password) || body.password.length < 6 || body.password.length > 12) {
        return fn({
            msg: '密码长度为6~14个字符,支持数字,大小写字母和标点符号,不允许有空格',
            status: 'fail',
            d: d
        })
    } else if (body.password.trim() != body.repass.trim()) {
        return fn({
            msg: '两次密码输入不一致',
            status: 'fail',
            d: d
        })
    }
    // else if (body.verify != session.captcha) {
    //     return fn({
    //         msg: '验证码错误',
    //         status: 'fail',
    //         d: d
    //     })
    // }

    d[1] = md5.md5(d[1]);

    mysql.do('SELECT * FROM users WHERE email="' + body.email + '"', function (err, data) {

        if (err) {
            return fn({msg: '未知错误', status: 'fail', t: 0});
        }
        if (data.length > 0) {
            return fn({msg: '用户已存在', status: 'fail', t: 1});
        }

        d.push(+new Date);

        mysql.do('INSERT INTO users (`email`, `password`, `t1`) VALUES ("' + d.join('","') + '")', function (err) {

            if (err) {
                return fn({msg: '未知错误', status: 'fail', t: 2});
            }

            return fn({
                status: 'succ',
                email: d[0],
                msg: '注册成功'
            })
        })
    })
};
