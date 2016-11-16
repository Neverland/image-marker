/**
 * Created by Administrator on 14-2-20.
 */
module.exports = function (q, s, type){

	var rootURL = process.cwd(),
		secret = process.env.MAIN_KEY,
		md5 = require(process.cwd() + '/md5.js'),
	   	db = require(rootURL +'/mongodb.js')(s),

		pointlink = require(rootURL + '/web/dataAPI/pointlink'),
		decword = require(rootURL + '/web/dataAPI/decword'),

		err = function (s){
			s.render('404',{
				status: 404,
				title: 'image-marker'
			});

		},
		query = q.query,
		md5Str;

		if(!query || !query.image || !q.params.id) {
			//console.log(!query , !query.image , !q.params.id);
			//console.log(query, '---------' ,1);
			err(s) ;
			return false;
		}

		//db.decword.remove();
		//db.imageMarker.remove();


		md5Str  = md5.md5(query.image + secret);
		console.log(q.params.id, 4);

		type = 'decword' && decword(q, s, md5Str, db);
		type = 'pointlink' && pointlink(q, s, md5Str, db);
}
