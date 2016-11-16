/**
 * Created by Administrator on 14-1-24.
 */

	module.exports = function () {


		var db = require('mongojs'),
			env,
			mongo;


		if(process.env.VCAP_SERVICES){
			env = JSON.parse(process.env.VCAP_SERVICES),
			mongo = env['mongodb2-2.4.8'][0]['credentials'];

		}
		else{
			mongo = {
				"hostname":"localhost",
				"port":27017,
				"username":"",
				"password":"",
				"name":"",
				"db":"db"
			}
		}

		var generate_mongo_url = function(obj){
			obj.hostname = (obj.hostname || 'localhost');
			obj.port = (obj.port || 27017);
			obj.db = (obj.db || 'test');
			if(obj.username && obj.password){
				return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
			}
			else{
				return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
			}
		}
		return db.connect(generate_mongo_url(mongo),['imageMarker', 'decword']);
	}
