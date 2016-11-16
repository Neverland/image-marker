/**
 * Created by Administrator on 14-2-20.
 */

	var r = require(__dirname +'/../../response'),
	secret = process.env.MAIN_KEY || '12345',
	md5 = require(process.cwd() + '/util/_md5');
	r.all('jsonp');


	var pre = function (query){

		if(/^undefined$/g.test( query.decword.trim())){
			return [];
		}
		var pos = query.pos || 0,
			dw = query.decword.substring(0,86);

		return r.escapeData([pos, dw]);
	}

	exports['queryDecWord.ctrl'] = function (q, s, md5Str, db) {

		if(q.query.id){
			md5Str = q.query.id;
		}

		db.do('select `pos`, `dw` from des where kys="'+ r.escape(md5Str.toString()) +'"', function (err, data) {

			if(err || data.length == 0){
				r.fail(s, {f:1});
				return false;
			}
			r.succ(s, data );

		})
	}
	exports['addDecWord.ctrl'] = function (q, s, md5Str, db) {

		var d = pre(q.query);

		if(d.length == 0) {
			r.fail(s, {f:2});
			return false;
		}

		db.do('select * from des where kys="'+ r.escape(md5Str.toString()) +'"', function (err, data) {

			if(err){
				r.fail(s, {f:3});
				return false;
			}

			if(data.length == 0){
				db.do('insert into des (`pos`, `dw`, `kys`) values("'+d.join('","')+'","'+r.escape(md5Str.toString())+'")', function (err){
					if(err){
						r.fail(s, {f:4});
						return false;
					}
					r.succ(s);

				})
			} else {

				db.do('update des set `pos`="'+r.escape(d[0].toString())+'" `dw`="'+r.escape(d[1].toString())+'" where kys ="'+r.escape(md5Str.toString())+'"', function (err){
					if(err){
						r.fail(s, {f:5});
						return false;
					}
					r.succ(s);

				})
			}
			db.do('select * from imgs where img="'+md5Str+'"', function (err, data){

				if(err) return false;

				if(data.length == 0){

					db.do('insert into imgs (`img`, `url`, `time`) values ("'+md5Str+'","'+md5.encrypt(r.escape(q.query.image), secret)+'","'+ (+new Date)+'")', function (err, data){
					});
					return false;
				}
				if(data.length == 1){

					db.do('update imgs set `img`="'+md5Str+'", `url`="'+md5.encrypt(r.escape(q.query.image), secret)+'", `time`="'+(+new Date)+'"', function (err, data){});

				}
			})
		})
	}
	exports['deleteDecWord.ctrl'] = function (q, s, md5Str, db) {
		db.do('delete from des where kys="'+ r.escape(md5Str.toString()) +'"', function (err, data){
			if(err){
				r.fail(s, {f:6});
				return false;
			}
			r.succ(s);

		})
	}
