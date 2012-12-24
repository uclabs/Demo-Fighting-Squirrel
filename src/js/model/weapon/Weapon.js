/**
 * Base Model for Weapon
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Weapon', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        type = 'Weapon',
        Weapon = Class.extend({
            type: type,
            ctor: function (opts) {
                var that = this;
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenClient(this.uuid, function() {
                    var args = slice.apply(arguments);
                    args.unshift(that.uuid);
                    that.sendMessage(type, args);
                });
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            // 发射武器
            fire: function(force) {
                log('Weapon:' + this.uuid, 'fire');
                var that = this;
                // 发射武器
                // TODO box2d发射武器
                
                // 定时获取位置

                // 绑定结束事件
                // TODO 替换成监听box2d中的运动结束事件
                setTimeout(function() {
                    that.finish();
                }, Math.random() * 2000 + 1500);
            },
            // 发射完毕
            finish: function() {
                log('Weapon:' + this.uuid, 'finish');
                this.sendMessage(type, [this.uuid, 'finish']);
            },
            // 获取当前位置
            position: function() {
                // TODO 替换成从box2d中取出位置
                return {
                    x: Math.random() * 1024,
                    y: Math.random() * 600
                };
            },
            stateHandler: {
                idle: {
                    init: function () {},
                    main: function () {},
                    exit: function () {}
                },
                active: {
                    init: function () {},
                    main: function () {},
                    exit: function () {}
                }
            }
        });

    Weapon.type = type;

    return Weapon;
});