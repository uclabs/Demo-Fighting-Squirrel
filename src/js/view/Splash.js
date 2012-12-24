/**
 * Splash
 *
 * @import ../../lib/elf/core/lang.js
 * @import mixin/EventMixin.js
 */
elf.define('FS::View::Splash', ['lang', 'FS::View::EventMixin'], function (_, eventMixin) {
    'use strict';

    var splash = {},
        _splash = document.getElementById('splash');

    // 把事件 mixin
    _.extend(splash, eventMixin);
    
    // 绑定来自 manager 的指令
    splash.listenServer('splash', function(method, args) {
        splash[method].apply(splash, args);
    });

    splash.show = function show() {
        log('splash', 'show');
    };

    splash.hide = function hide() {
        log('splash', 'hide');
    };

    return splash;
});