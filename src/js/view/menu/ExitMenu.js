/**
 * ExitMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::ExitMenu', ['lang', 'FS::Util', 'FS::View::EventMixin'], function (_, util, eventMixin) {
    'use strict';
    var menu = {
        mix: util.mix()
    };

    // 把事件 mixin
    menu.mix(eventMixin);
    
    // 绑定来自 manager 的指令
    menu.listenController('exitMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        log('view:exitMenu', 'show');
    };

    menu.hide = function hide() {
        log('view:exitMenu', 'hide');
    };

    return menu;
});