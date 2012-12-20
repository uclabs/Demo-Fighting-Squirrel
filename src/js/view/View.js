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
    'FS::View::Splash',
    'FS::View::MainMenu'
], function (_, async, eventMixin, splash, mainMenu) {
    'use strict';

    var view = {};

    // 把事件 mixin
    _.extend(view, eventMixin);

    view.init = function() {
        console.log('[view] init');
    };

    return view;
});