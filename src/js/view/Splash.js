/**
 * Splash
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../Util.js
 * @import ./mixin/EventMixin.js
 */
elf.define('FS::View::Splash', ['lang', 'FS::Util', 'FS::View::EventMixin'], function (_, util, eventMixin) {
    'use strict';

    var splash = {
            mix: util.mix
        },
        _splash = document.getElementById('splash');

    // 把事件 mixin
    splash.mix(eventMixin);
    
    // 绑定来自 manager 的指令
    splash.listenController('splash', function(method, args) {
        splash[method].apply(splash, args);
    });

    splash.show = function show() {
        log('view:splash', 'show');
    };

    splash.hide = function hide() {
        log('view:splash', 'hide');
    };

    return splash;
});