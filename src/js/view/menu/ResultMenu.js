/**
 * ResultMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::ResultMenu', ['lang', 'FS::View::EventMixin'], function (_, eventMixin) {
    'use strict';
    var menu = {};

    // 把事件 mixin
    _.extend(menu, eventMixin);
    
    // 绑定来自 manager 的指令
    menu.bind('resultMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        console.log('[resultMenu] show');
    };

    menu.hide = function hide() {
        console.log('[resultMenu] hide');
    };

    return menu;
});