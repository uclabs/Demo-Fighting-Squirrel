/**
 * Splash
 *
 * @import ../../lib/elf/core/lang.js
 * @import mixin/EventMixin.js
 */
elf.define('FS::View::Splash', ['lang', 'FS::View::EventMixin'], function (_, eventMixin) {
    var that = this,
        exports = {},
        splash = document.getElementById('splash');

     exports.show = function show() {
        console.log('i am splash, i am hide');
    };

    exports.hide = function hide() {
        console.log('i am splash, i am hide');
    };

    // 把事件 mixin
    _.extend(this, eventMixin);
    
    this.bind('splash', function(method, args) {
        exports[method].apply(that, args);
    });

    return exports;
});