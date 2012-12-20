/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../mixin/EventMixin.js
 */
elf.define('FS::View::MainMenu', ['lang', 'FS::View::EventMixin'], function (_, eventMixin) {
    'use strict';
    var mainMenu = {};

    // 把事件 mixin
    _.extend(mainMenu, eventMixin);
    
    // 绑定来自 manager 的指令
    mainMenu.bind('mainMenu', function(method, args) {
        mainMenu[method].apply(mainMenu, args);
    });

    mainMenu.show = function show() {
        console.log('i am mainMenu, i am show');
        // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
        setTimeout(function() {
            // 向 manager 发送游戏开始的消息
            mainMenu.fire('mode', ['multi-player']);
            mainMenu.fire('game', ['start']);
        }, 2000);
    };

    mainMenu.hide = function hide() {
        console.log('i am mainMenu, i am hide');
    };

    return mainMenu;
});