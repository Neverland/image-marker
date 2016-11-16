/**
 * Created by enix@foxmail.com on 14-3-15.
 */


module.exports = function (callback) {

    var cluster = require('cluster'),
        CPUs = require('os').cpus().length,
        cb = typeof(callback) == 'function' ? callback : function () {
        }


    function createCluster() {
        var i = CPUs;
        for (; i--;) {
            cluster.fork();
        }
    }

    cluster.isMaster ? createCluster() : cb();

    cluster.on('death', function () {
        cluster.fork();
    });
};
