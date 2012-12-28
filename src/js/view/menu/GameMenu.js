/**
 * GameMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::GameMenu', ['lang', 'FS::Util', 'FS::View::EventMixin'], function (_, util, eventMixin) {
    'use strict';
    var menu = {
        mix: util.mix
    };

    // 把事件 mixin
    menu.mix(eventMixin);
    
    // 绑定来自 manager 的指令
    menu.listenController('gameMenu', function (method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        log('view:gameMenu', 'show');
    };

    menu.hide = function hide() {
        log('view:gameMenu', 'hide');
    };

    return menu;
});