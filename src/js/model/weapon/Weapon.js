/**
 * Base Model for Weapon
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Config.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Weapon', [
    'lang',
    'class',
    'FS::Config',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, config, eventMixin, messageMixin, elementMixin, stateMixin) {
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
                this.listenView(this.uuid, function() {
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
                log('controller:Weapon:' + this.uuid, 'fire');
                var that = this;
                // 发射武器
                // TODO-box2d 发射武器

                // 绑定结束事件
                // TODO-box2d 替换成监听box2d中的运动结束事件
                setTimeout(function() {
                    that.changeState('idle');
                }, Math.random() * 2000);

                // 切换到攻击状态
                this.changeState('attack');
            },
            // 获取当前位置
            position: function() {
                // TODO-box2d 替换成从box2d中取出位置
                return {
                    x: Math.random() * 1024,
                    y: Math.random() * 600
                };
            },
            stateHandler: {
                // 攻击中
                attack: {
                    init: function () {
                        clearTimeout(this.attackTimer);
                    },
                    main: function () {
                        var that = this,
                            position = this.position();

                        // 获取当前位置并发回
                        this.move(position);

                        // 攻击未结束前，持续更新
                        this.attackTimer = setTimeout(function() {
                            if (that.state !== 'idle') {
                                that.changeState('attack');
                            }
                        }, config.frameInterval);
                    },
                    exit: function () {
                        clearTimeout(this.attackTimer);
                    }
                },
                // 发射完毕
                idle: {
                    init: function () {
                        clearTimeout(this.attackTimer);
                    },
                    main: function () {
                        log('controller:Weapon:' + this.uuid, 'idle');
                        this.sendMessage(type, [this.uuid, 'idle']);
                    },
                    exit: function () {}
                }
            }
        });

    Weapon.type = type;

    return Weapon;
});