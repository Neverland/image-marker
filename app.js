/**
 * Created by Administrator on 14-3-7.
 */
	var cluster = require('cluster'),
		http = require('http'),
		app = require(process.cwd() + '/server.js').server,
		CPUs = require('os').cpus().length;


	function createCluster(){
		var i = CPUs;
		for (;i--;) {
			cluster.fork();
		}
	}

	cluster.isMaster ? createCluster() : app();

	cluster.on('death', function() {
		cluster.fork();
	});