/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../lib/elf/mod/box2d.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::Model::Stage', [
    'lang',
    'class',
    'box2d',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, Box2D, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        // Box2d 相关定义
        b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        // 模型相关
        type = 'Stage',
        Stage = Class.extend({
            type: type,
            density: 30, // 密度
            friction: 1, // 摩擦力
            restitution: 0, // 弹性
            width: 400,
            height: 10,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.createBody();
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            createBody: function() {
                var userData = {uuid: this.uuid};
                // 物体定义
                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_staticBody;

                // 材质定义
                var fixDef = new b2FixtureDef;
                fixDef.density = this.density;
                fixDef.friction = this.friction;
                fixDef.restitution = this.restitution;
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(this.scale(this.width / 2), this.scale(this.height / 2));

                // 由世界创建物体
                // 左树杈
                bodyDef.position = new b2Vec2(this.scale(200), this.scale(600));
                var branch1 = this.world.CreateBody(bodyDef);
                branch1.CreateFixture(fixDef);
                branch1.SetUserData(userData);

                // 右树杈
                bodyDef.position = new b2Vec2(this.scale(824), this.scale(600));
                var branch2 = this.world.CreateBody(bodyDef);
                branch2.CreateFixture(fixDef);
                branch2.SetUserData(userData);

                this.branches = [branch1, branch2];
                return this.branches;
            }
        });

    Stage.type = type;

    return Stage;
});