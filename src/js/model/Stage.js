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
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.createBody();
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            createBody: function() {
                // 物体定义
                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_staticBody;
                bodyDef.position.x = this.x;
                bodyDef.position.y = this.y;

                // 材质定义
                var fixDef = new b2FixtureDef;
                fixDef.density = this.density;
                fixDef.friction = this.friction;
                fixDef.restitution = this.restitution;
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(this.width, this.height);

                // 由世界创建物体
                this.body = this.world.CreateBody(bodyDef);
                this.body.uuid = this.uuid;
                // 创建物体相应的材质
                this.fixture = this.body.CreateFixture(fixDef);
                this.fixture.uuid = this.uuid;
                return this.body;
            }
        });

    Stage.type = type;

    return Stage;
});