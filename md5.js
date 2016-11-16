/**
 * Created by enix@foxmail.com on 14-3-3.
 */

	var crypto = require('crypto');

	//exports.hash = hash;

	exports.md5 = function (str) {
		return crypto.createHash('md5').update(str).digest('hex');
	}

	exports.encrypt = function (str, secret) {
		var cipher = crypto.createCipher('aes192', secret);
		var enc = cipher.update(str, 'utf8', 'hex');
		enc += cipher.final('hex');
		return enc;
	};

	exports.decrypt = function (str, secret) {
		var decipher = crypto.createDecipher('aes192', secret);
		var dec = decipher.update(str, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	};