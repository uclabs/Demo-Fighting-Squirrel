/**
 * Base Model for Weapon
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../../lib/elf/mod/box2d.js
 * @import ../../Config.js
 * @import ../../Util.js
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
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, Box2D, config, util, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        // Box2d 相关定义
        b2Vec2 = Box2D.Common.Math.b2Vec2,
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
            ctor: function (opts) {
                var that = this;
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.createBody();
                this.listenView(this.uuid, function () {
                    var args = slice.apply(arguments);
                    args.unshift(that.uuid);
                    that.sendMessage(type, args);
                });
            },
            mix: util.mix,
            createBody: function () {
                this.body = null;
            },
            // 发射武器
            fire: function (vector) {
                log('controller:Weapon:' + this.uuid, 'fire', vector);

                // 切换到攻击状态
                this.changeState('attack');
            },
            stateHandler: {
                // 攻击中
                attack: {
                    init: function () {
                        clearTimeout(this.attackTimer);
                    },
                    main: function () {
                        var that = this,
                            position = this.position(),
                            x = position.x,
                            y = position.y,
                            lastAttackPosition = this.lastAttackPosition;

                        // 判断是否飞出场景
                        if (x < 0|| x > config.world.width ||
                            y < 0 || y > config.world.height) {
                            if (this.state !== 'idle') {
                                log('controller:' + this.type + ':' + this.uuid, 'out of scene');
                                this.changeState('idle');
                            }
                            return;
                        }

                        // 判断是否停止移动
                        if (lastAttackPosition &&
                            (Math.abs(lastAttackPosition.x - x) < 10 &&
                            Math.abs(lastAttackPosition.y - y) < 10)) {
                            if (this.state !== 'idle') {
                                log('controller:' + this.type + ':' + this.uuid, 'not move');
                                this.changeState('idle');
                            }
                            return;
                        }

                        // 记录最后更新的攻击位置
                        this.lastAttackPosition = position;

                        // 攻击状态循环
                        this.attackTimer = setTimeout(function() {
                            that.changeState('attack');
                        }, 200);
                    },
                    exit: function () {
                        clearTimeout(this.attackTimer);
                    }
                },
                // 发射完毕
                idle: {
                    init: function () {
                    },
                    main: function () {
                    },
                    exit: function () {}
                }
            }
        });

    Weapon.type = type;

    return Weapon;
});