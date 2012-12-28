/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::MainMenu', ['lang', 'FS::Util', 'FS::View::EventMixin'], function (_, util, eventMixin) {
    'use strict';
    var menu = {
        mix: util.mix
    };

    // 把事件 mixin
    menu.mix(eventMixin);
    
    // 绑定来自 manager 的指令
    menu.listenController('mainMenu', function(method, args) {
        menu[method].apply(menu, args);
    });

    menu.show = function show() {
        log('view:mainMenu', 'show');
        // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
        setTimeout(function() {
            // 向 manager 发送游戏开始的消息
            menu.sendController('config', [{mode: 'multi-player'}]);
            menu.sendController('game', ['start']);
        }, 1000);
    };

    menu.hide = function hide() {
        log('view:mainMenu', 'hide');
    };

    return menu;
});