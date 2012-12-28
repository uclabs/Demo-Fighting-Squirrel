/**
 * ResultMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::ResultMenu', ['lang', 'FS::Util', 'FS::View::EventMixin'], function (_, util, eventMixin) {
    'use strict';
    var menu = {
        mix: util.mix()
    };

    // 把事件 mixin
    menu.mix(eventMixin);
    
    // 绑定来自 manager 的指令
    menu.listenController('resultMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        log('view:resultMenu', 'show');
    };

    menu.hide = function hide() {
        log('view:resultMenu', 'hide');
    };

    return menu;
});