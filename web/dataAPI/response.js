/**
 * Created by enix@foxmail.com on 14-3-15.
 */
exports.all = function (method) {

    var m = method = 'jsonp' ? 'jsonp' : 'json',
        send = function (s, data, flag) {

            data = data || {};
            data.state = flag == 0 ? 'fail' : 'succ';

            s[m](data);

        };

    exports.fail = function (s, data) {

        send(s, data, 0);

    };
    exports.succ = function (s, data) {

        send(s, data, 1);
    }

};

var escape = exports.escape = function (a) {
    return a.replace(/[\`|\"|\<|\>|\,|\;]/gi, function () {
        var a = arguments[0];
        return {
            "'": "\\'",
            '`': '\\`',
            '"': '\\"',
            '<': '&lt;',
            '>': '&gt;',
            ',': '\\,',
            ';': '\\;'
        }[a]
    })
};

exports.escapeData = function (data) {
    Array.isArray(data) && data.forEach(function (a, b) {
        typeof(a) == 'string' && (data[b] = escape(a.trim()));
    });

    'string' == typeof(data) && (data = escape(data));

    return data;
};
