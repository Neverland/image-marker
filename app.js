/**
 * Created by enix@foxmail.com on 14-3-7.
 */

var path = require('path'),
    child_process = require('child_process'),
    mainjs = path.join(require(__dirname + '/config.json').main);

!function (mod) {

    var worker = child_process.spawn('node', [mod]),
        self = arguments.callee;

    worker.on('exit', function (state) {
        state == 0 || self(mod);
    });

}(process.cwd() + '/server.js');
