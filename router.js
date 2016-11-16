/**
 * Created by enix@foxmail.com on 14-1-8.
 */

	var apiPath = require('path').join(process.cwd() + '/web/dataAPI/photoAPI');

	exports.all = function (q, s, n) {
		s.render('index', {
			title: 'image-marker'
		});
	}

	exports.index = function (q, s, n) {
		s.redirect('/');
	}

	exports.im = function (q, s, n) {
		s.render('imageMarker', {
			title: 'image-marker'
		});
	}

	exports.datAPI = function (q, s, n){
		try{
			q.params && q.params.method && require(apiPath)(q, s, q.params.method);
		}catch(e){}
	}
	exports.n404 = function(q, s, n) {
		s.render('404',{
			status: 404,
			title: 'image-marker'
		});
	}
