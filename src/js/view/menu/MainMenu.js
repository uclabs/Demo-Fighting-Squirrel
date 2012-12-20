/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::MainMenu', ['lang', 'FS::View::EventMixin'], function (_, eventMixin) {
    'use strict';
    var menu = {};

    // 把事件 mixin
    _.extend(menu, eventMixin);
    
    // 绑定来自 manager 的指令
    menu.bind('mainMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        console.log('[mainMenu] show');
        // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
        setTimeout(function() {
            // 向 manager 发送游戏开始的消息
            menu.fire('mode', ['multi-player']);
            menu.fire('game', ['start']);
        }, 2000);
    };

    menu.hide = function hide() {
        console.log('[mainMenu] hide');
    };

    return menu;
});