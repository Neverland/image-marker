/**
 * Created by Administrator on 14-2-20.
 */


module.exports = function (q, s, md5Str, db){

	var query = q.query,
		axis = query.axis,
		md5 = require(process.cwd() + '/md5.js');

	//建索引

	db.imageMarker.ensureIndex({img: md5Str, unique: true});


	try {
		({
			//查询
			'querypoint.ctrl': function (){

				db.imageMarker.find({img: md5Str}, {_id: 0, img:0 }, function (err, data){
					if(err){
						s.jsonp({state:'fail', id: md5Str});
						return;
					}
					s.jsonp({state:'succ', img: md5Str, data: data })
				});
			},
			//更新 插入
			'addpoint.ctrl': function (){

				var point = { },
					regAxis = /^\d{1,3},\d{1,3},\d{1,3},\d{1,3}$/g,
					id;

				query.title  && query.title.length <256 && (point.title = query.title);
				//query.desc && query.desc.length <256 && (point.desc = query.desc);
				//query.link && query.link.length<256 && (point.link = query.link);

				query.desc && (point.desc = query.desc.substring(0,256));
				query.desc || (point.desc = null);

				query.link && query.link.length<256 && (point.link = query.link);
				query.link || (point.link = null);


				if(!axis  || !regAxis.test(axis)){
					s.jsonp({state:'fail',  id: md5Str, code: 0});
					return false;
				}

				point.axis = axis;

				query.size  && /^\d{1,3},\d{1,3}$/g.test(query.size)  && (point.size = query.size);

				id = query.id ? query.id : md5.encrypt(axis, md5Str);

				console.log(regAxis.test(md5.decrypt(id, md5Str)));

				if(!regAxis.test(md5.decrypt(id, md5Str))){
					s.jsonp({state:'fail',  id: md5Str, code: 1});
					return false;
				}

				point.axis = axis;
				point.id = id;
				point.img = md5Str;

				db.imageMarker.findAndModify({
					query: { img: md5Str, id: id },
					update: { $set: point },
					upsert: true,
					new: true
				},function (err, data){

					if(err){
						s.jsonp({state:'fail',  img: md5Str, code: 2, err: err});
						return false;
					}
					s.jsonp({state:'succ', img: md5Str});
				});

			},

			'deletepoint.ctrl': function (){

				var id = query.id;

				if(!id) {
					s.jsonp({state:'fail',  img: md5Str});
					return false;
				}

				db.imageMarker.remove({ img: md5Str, id: id },function (err, data){
					if(err){
						s.jsonp({state:'fail',  img: md5Str});
						return false;
					}
					s.jsonp({state:'succ',id: data[0]});
				})
			}
		})[q.params.id]();

	}catch(e){}
}
