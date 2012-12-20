/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../model/mixin/EventMixin.js
 */
elf.define('FS::Controller::Manager', ['lang', 'async', 'FS::Model::EventMixin'], function (_, async, eventMixin) {
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
    });

    manager.bind('game', function(action) {
        console.log('manager - game : ' + action);
        // 同步方法使用例子，后期酌情移除
        async.series([
            function(callback) {
            },
            function(callback) {
            }
        ], function(err, results) {
            console.log(results);
        });
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