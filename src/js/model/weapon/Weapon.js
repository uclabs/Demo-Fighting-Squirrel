/**
 * Base Model for Weapon
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../../lib/elf/mod/box2d.js
 * @import ../../Config.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Weapon', [
    'lang',
    'class',
    'box2d',
    'FS::Config',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, Box2D, config, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        // Box2d 相关定义
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        // 模型相关
        type = 'Weapon',
        Weapon = Class.extend({
            type: type,
            density: 5, // 密度
            friction: 0.5, // 摩擦力
            restitution: 0, // 弹性
            ctor: function (opts) {
                var that = this;
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.createBody();
                this.listenView(this.uuid, function() {
                    var args = slice.apply(arguments);
                    args.unshift(that.uuid);
                    that.sendMessage(type, args);
                });
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            createBody: function() {
                this.body = null;
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
                return this.body ? this.body.position : {x: 0, y: 0};
            },
            stateHandler: {
                // 攻击中
                attack: {
                    init: function () {
                    },
                    main: function () {
                        var that = this,
                            position = this.position();

                        // 获取当前位置并发回
                        this.move(position);
                    },
                    exit: function () {
                    }
                },
                // 发射完毕
                idle: {
                    init: function () {
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