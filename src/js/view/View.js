/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import mixin/EventMixin.js
 */
elf.define('FS::View::View', [
    'lang',
    'async',
    'FS::View::EventMixin',
    'FS::View::Splash'
], function (_, async, eventMixin, splash) {
    var exports = {};

    // 把事件 mixin
    _.extend(this, eventMixin);

    exports.init = function() {

    };

    return exports;
});