/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Config.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Menu', [
    'lang',
    'class',
    'FS::Config',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, config, util, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Menu',
        Menu = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));

                // 派发场景创建消息
                //this.sendMessage('Scene:create', [this]);
            },
            mix: util.mix,
            stateHandler: function () {
            },
            // 切换到本场景
            replace: function (transition, time) {
                log('view:' + this.type + ':' + this.uuid, 'replace', transition, time);
                // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
                var that = this;
                setTimeout(function () {
                    // 向 manager 发送游戏开始的消息
                    that.sendController('player', [config.player]);
                    that.sendController('options', [{mode: 'multi-player'}]);
                    that.sendController('options', [{mode: 'online'}]);
                    that.sendController('game', ['start']);
                }, 1000);
                // this.sprite.replaceScene(this.sprite, transition || 'Fade', time || 0);
            },
            addChild: function (uuid, zOrder, tag) {
                var child = this.elements[uuid];
            }
        });

    Menu.type = type;

    return Menu;
});