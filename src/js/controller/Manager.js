/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import Messager.js
 * @import ../model/mixin/EventMixin.js
 */
elf.define('FS::Controller::Manager', [
    'lang',
    'async',
    'FS::Controller::Messager',
    'FS::Model::EventMixin'
], function (_, async, messager, eventMixin) {
    'use strict';

    var manager = {},
        views = ['splash', 'mainMenu', 'resultMenu'];

    // 把事件 mixin
    _.extend(manager, eventMixin);

    views.forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            if (!manager[name]) {
                manager[name] = {};
            }
            manager[name][method] = function () {
                manager.fire(name, [method]);
            };
        });
    });

    manager.bind('mode', function(mode) {
        console.log('manager - mode : ' + mode);
        messager.fire('director', ['config', {mode: mode}]);
    });

    manager.bind('game', function(action) {
        switch(action) {
            case 'start':
                console.log('manager : director-start');
                messager.fire('director', ['start']);
                break;

            case 'stop':
                console.log('manager : director-stop');
                messager.fire('director', ['stop']);
                break;

            case 'restart':
                console.log('manager : director-restart');
                messager.fire('director', ['restart']);
                break;
        }
    });

    manager.bind('director', function(state) {
        switch(state) {
            case 'ready':
                manager.fire('mainMenu', ['hide']);
                manager.fire('gameMenu', ['show']);
                messager.fire('director', ['show']);
                break;
        }
    });

    function init() {
        // 同步方法使用例子，后期酌情移除
        async.series([
            function(callback) {
                manager.splash.hide();
                callback(null, 'splash.hide');
            },
            function(callback) {
                manager.mainMenu.show();
                callback(null, 'mainMenu.show');
            }
        ], function(err, results) {
            console.log(results);
        });
    };

    return {
        init: init
    };
});