/**
 * Created by Administrator on 14-2-20.
 */


	var secret = process.env.MAIN_KEY || '12345',
		md5 = require(process.cwd() + '/util/_md5'),
		r = require(__dirname +'/../../response');

		r.all('jsonp');

	var	pre = function (query, md5Str) {

		var img = md5Str,
			title,
			desc,
			link,
			axis ,
			size,
			kys,
			w,
			h,
			time = +new Date,
			regAxis = /^\d{1,3},\d{1,3},\d{1,3},\d{1,3}$/g;

		axis =  query.axis;
		query.title  && query.title.length <256 && (title = query.title);
		//query.desc && query.desc.length <256 && (point.desc = query.desc);
		//query.link && query.link.length<256 && (point.link = query.link);

		query.desc && (desc = query.desc.substring(0,256));
		query.desc || (desc = null);

		query.link && query.link.length<256 && (link = query.link);
		query.link || (link = null);


		if(!axis  || !regAxis.test(axis)){
			console.log(!axis  , !regAxis.test(axis),222);
			return [];
		}

		axis = axis;

		query.size  && /^\d{1,3},\d{1,3}$/g.test(query.size)  && (size = query.size.split(','), w = size[0] , h = size[1] );

		kys = query.id ? query.id : md5.encrypt(axis, md5Str);

		console.log(regAxis.test(md5.decrypt(kys, md5Str)) ,  md5.encrypt(axis, md5Str));

		if(!regAxis.test(md5.decrypt(kys, md5Str))){
			console.log(!regAxis.test(md5.decrypt(kys, md5Str)),333)
			return [];
		}

		axis = axis;
		kys = kys

		return r.escapeData([title, axis, desc, link, img, time, kys, w, h]);

	};


	exports['querypoint.ctrl'] = function (q, s, md5Str, db) {

		if(q.query.id){
			md5Str = q.query.id;
		}

		db.do('select `title`, `axis`, `desc`, `link`, `kys` as id, `w`, `h` from points where img="'+ r.escape(md5Str.toString()) +'"', function (err, data) {

			if(err || data.length ==0){
				r.fail(s, {f:1,err: err});
				return false;
			}
			r.succ(s, {data:data});
		})
	}

	exports['addpoint.ctrl'] = function (q, s, md5Str, db) {
		var d = pre(q.query, md5Str);

		if(d.length == 0) {
			r.fail(s, {f:2});
			return false;
		}
		db.do('select * from points where img="'+ r.escape(d[4].toString()) +'"',function (err, data){

			if(err || data.length>= 10){

				r.fail(s, {f:0, msg: data.length>=20?'只能标注20个点位' : err});
				return false;
			}

			db.do('select * from points where img="'+ r.escape(d[4].toString()) +'" and kys="'+ r.escape(d[6].toString()) +'"', function (err, data) {
				if(err){

					r.fail(s, {f:3});
					return false;
				}

				if(data.length == 0){
					db.do('insert into points (`title`, `axis`, `desc`, `link`, `img`, `time`, `kys`, `w`, h) values("'+d.join('","')+'")', function (err){
						if(err){
							r.fail(s,{data:err, f:4});
							return false;
						}
						r.succ(s);
					})
				} else {
					db.do('update points set `title`="'+d[0]+'", `axis`="'+d[1]+'", `desc`="'+d[2]+'", `link`="'+d[3]+'",`time`="'+d[5]+'",`w`="'+d[7]+'", `h`="'+d[8]+'" where img ="'+d[4]+'" and kys ="'+d[6]+'"', function (err){
						if(err){
							r.fail(s,{data:err, f:5});
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
		})

	}

	exports['deletepoint.ctrl'] = function (q, s, md5Str, db) {
		var id = q.query.id;

		if(!id) {
			r.fail({state:'fail',  img: md5Str, f:6});
			return false;
		}

		db.do('delete from points where kys="'+ id +'"', function (err, data){
			if(err){
				r.fail(s, {f:7});
				return false;
			}
			r.succ(s);
		})
	}

