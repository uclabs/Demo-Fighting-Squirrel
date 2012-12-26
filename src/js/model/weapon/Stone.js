/**
 * Stone
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/box2d.js
 * @import ./Weapon.js
 */
elf.define('FS::Model::Stone', [
    'lang',
    'box2d',
    'FS::Model::Weapon'
], function (_, Box2D, Weapon) {
    'use strict';
    var slice = Array.prototype.slice,
        // Box2d 相关定义
        b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        // 模型相关
        type = 'Stone',
        Stone = Weapon.extend({
            density: 5, // 密度
            friction: 0.5, // 摩擦力
            restitution: 0, // 弹性
            width: 10,
            type: type,
            createBody: function() {
                // 物体定义
                var bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position= new b2Vec2(this.x, this.y);

                // 材质定义
                var fixDef = new b2FixtureDef;
                fixDef.density = this.density;
                fixDef.friction = this.friction;
                fixDef.restitution = this.restitution;
                fixDef.shape = new b2CircleShape(this.width / 2);

                // 由世界创建物体
                this.body = this.world.CreateBody(bodyDef);
                this.body.uuid = this.uuid;
                // 创建物体相应的材质
                this.fixture = this.body.CreateFixture(fixDef);
                this.fixture.uuid = this.uuid;
                return this.body;
            },
            fire: function() {
                var body = this.body,
                    x = this.x;
                body.ApplyForce(
                    new b2Vec2(50, 50),
                    body.GetWorldCenter()
                );
                this._super();
            }
        });

    Stone.type = type;

    return Stone;
});