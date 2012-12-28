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
            fire: function(vector) {
                log('controller:Weapon:' + this.uuid, 'fire', vector);

                // 切换到攻击状态
                this.changeState('attack');
            },
            stateHandler: {
                // 攻击中
                attack: {
                    init: function () {
                    },
                    main: function () {
                    },
                    exit: function () {
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