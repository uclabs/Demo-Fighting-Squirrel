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
    menu.listenServer('mainMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        log('mainMenu', 'show');
        // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
        setTimeout(function() {
            // 向 manager 发送游戏开始的消息
            menu.sendServer('config', [{mode: 'multi-player'}]);
            menu.sendServer('game', ['start']);
        }, 1000);
    };

    menu.hide = function hide() {
        log('mainMenu', 'hide');
    };

    return menu;
});