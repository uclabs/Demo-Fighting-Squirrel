/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../model/mixin/EventMixin.js
 */
elf.define('FS::Controller::Manager', ['lang', 'async', 'FS::Model::EventMixin'], function (_, async, eventMixin) {
    var keys = Object.keys,
        slice = Array.prototype.slice,
        manager = {
            splash: {},
            mainMenu: {},
            resultMenu: {}
        };

    // 把事件 mixin
    _.extend(manager, eventMixin);

    keys(manager).forEach(function (name) {
        ['show', 'hide'].forEach(function(method) {
            manager[name][method] = function () {
                manager.fire(name, [method]);
            };
        });
    });

    manager.init = function() {
        // 同步方法使用例子，后期移除
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

    return manager;
});