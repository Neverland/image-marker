/**
 * Created by Administrator on 14-2-20.
 */

module.exports = function (q, s, md5Str, db) {

    var query = q.query,
        secret = process.env.MAIN_KEY,
        md5 = require(process.cwd() + '/_md5.js');


    try {
        ({
            'queryDecWord.ctrl': function () {
                db.decword.find({id: md5Str}, {_id: 0}, function (err, data) {
                    if (err) {
                        s.jsonp({state: 'fail', id: md5Str});
                        return false;
                    }
                    data[0] && (data[0].state = 'succ');
                    s.jsonp(data);
                });
            },
            'addDecWord.ctrl': function () {

                if (/^undefined$/g.test(query.decword.trim())) {
                    s.jsonp({state: 'fail', id: md5Str, code: 0});
                    return false;
                }

                var id,
                    words = {
                        pos: query.pos || 0,
                        dw: query.decword.substring(0, 86)
                    };

                id = query.id ? query.id : md5.encrypt(md5Str, secret);

                if (md5Str !== (md5.decrypt(id, secret))) {
                    s.jsonp({state: 'fail', id: md5Str, code: 0});
                    return false;
                }

                db.decword.findAndModify({
                    query: {id: md5Str},
                    update: {$set: words},
                    upsert: true,
                    new: true
                }, function (err, data) {
                    if (err) {
                        s.jsonp({state: 'fail', img: md5Str});
                        return false;
                    }
                    s.jsonp(/*{state:'succ', img: md5Str,data: data}*/JSON.stringify(words));
                });

            },
            'deleteDecWord.ctrl': function () {

                var id = query.id;

                if (!id) {
                    s.jsonp({state: 'fail', img: md5Str});
                    return false;
                }

                db.decword.remove({id: md5Str}, function (err, data) {
                    if (err) {
                        s.jsonp({state: 'fail', img: md5Str});
                        return false;
                    }
                    s.jsonp({state: 'succ', id: data[0]});
                })
            }
        })[q.params.id]();
    }
    catch (e) {}
};
