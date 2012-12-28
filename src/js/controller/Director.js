/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/core/event.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../lib/elf/mod/async.js
 * @import ../../lib/elf/mod/box2d.js
 * @import ../Config.js
 * @import ../Util.js
 * @import ../model/mixin/EventMixin.js
 * @import ../model/mixin/MessageMixin.js
 * @import ../model/mixin/StateMixin.js
 * @import ../model/Scene.js
 * @import ../model/Timer.js
 * @import ../model/Stage.js
 * @import ../model/role/Role.js
 * @import ../model/weapon/Weapon.js
 */
elf.define('FS::Controller::Director', [
    'lang',
    'event',
    'class',
    'async',
    'box2d',
    'FS::Config',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::StateMixin',
    'FS::Model::Scene',
    'FS::Model::Timer',
    'FS::Model::Stage',
    'FS::Model::Role',
    'FS::Model::Squirrel',
    'FS::Model::Weapon',
    'FS::Model::Stone'
], function (_, Event, Class, async, Box2D, config, util, eventMixin, messageMixin, stateMixin, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var slice = Array.prototype.slice,
        concat = Array.prototype.concat,

        // Box2d 相关定义
        b2Vec2 = Box2D.Common.Math.b2Vec2, // 向量(x ,y)
        // Box2D.Dynamics.Contacts>>>碰撞管理包
        b2BodyDef = Box2D.Dynamics.b2BodyDef, // 刚体定义.
        b2Body = Box2D.Dynamics.b2Body, // 刚体或叫物体.
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef, // 材质定义类
        b2Fixture = Box2D.Dynamics.b2Fixture, // 材质类
        b2World = Box2D.Dynamics.b2World, // 物理世界
        b2Listener = Box2D.Dynamics.b2ContactListener, // 碰撞监听
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw, //调试绘图,用于调试.
        // Box2D.Collision.Shapes>>>碰撞形状形变包；
        b2MassData = Box2D.Collision.Shapes.b2MassData, // 质量运算器.
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, // 凸多边形.
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, //圆外形

        // 工具方法
        isRole = util.isRole,
        isWeapon = util.isWeapon,

        // 游戏相关定义
        uuid = 0,
        Director,
        Classes = {};

    [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone].forEach(function(Class) {
        Classes[Class.type] = Class;
        Class.create = Class.create || function (opts) {
            opts = opts || {};
            opts.uuid = 'u' + (++uuid);
            return new Class(opts);
        };
    });

    // 方法分发器
    function dispactor() {
        var slice = Array.prototype.slice,
            action = arguments[0],
            fn = this[action];
        if (_.type(fn) === 'function') {
            fn.apply(this, slice.call(arguments, 1));
        }
    }

    Director = Class.extend({
        // 配置属性
        player1: {
            race: ''
        },
        player2: {
            race: ''
        },

        // 游戏状态
        elements: {}, // 物件
        side: 1, // 回合方
        round: 0, // 当前回合数
        attacking: {
            role: null, // 进攻角色
            weapon: null, // 武器
            force: null // 攻击力量
        },

        // 构造函数
        ctor: function(opts) {
            log('director', 'init', opts);
            this.mix(eventMixin, messageMixin, stateMixin);
            this.config(opts);

            // 创建碰撞事件
            this.impact = new Event();

            // 创建 Box2d 的物理世界
            this.initWorld();

            this.listenMessage('director', dispactor.bind(this));
            this.listenMessage(Role.type, this.onRole.bind(this));
            this.listenMessage(Weapon.type, this.onWeapon.bind(this));
        },
        mix: util.mix(),
        config: function(opts) {
            log('director', 'config', opts);
            _.extend(true, this, opts);
        },

        create: function(type, opts) {
            var Class = Classes[type],
                instance;
            if (Class) {
                opts = opts || {};
                opts.world = this.world;
                instance = Class.create(opts);
                // 添加入元素列表中
                this.add(opts.uuid, instance);
                // 向 view 派发创建指令
                log('director', instance.type + '.create', opts.uuid, opts);
                this.sendView(instance.type, ['create', instance.config()]);
                return instance;
            }
        },
        // 把元素加入列表中
        add: function(uuid, element) {
            this.elements[uuid] = element;
        },
        // 获取元素
        get: function(uuid) {
            return this.elements[uuid];
        },

        // 角色响应方法
        onRole: function(uuid, action) {
            var args = slice.call(arguments, 2),
                role = this.get(uuid);
            args.unshift(role);
            switch(action) {
                case 'attack':
                    this.attack.apply(this, args);
                    break;
            }
        },
        // 武器响应方法
        onWeapon: function(uuid, action) {
            var args = slice.call(arguments, 2),
                weapon = this.get(uuid);
            args.unshift(weapon);
        },

        // 冻结
        freeze: function() {
            this.freezeRoleGroup();
        },
        // 冻结角色
        idleRoleGroup: function(roleGroup) {
            if (roleGroup) {
                roleGroup.forEach(function(role) {
                    role.changeState('idle');
                });
            } else {
                [this.roleGroup1, this.roleGroup2].forEach(function(group) {
                    this.freezeRoleGroup(group);
                });
            }
        },
        activeRoleGroup: function(roleGroup) {
            if (roleGroup) {
                roleGroup.forEach(function(role) {
                    role.changeState('active');
                });
            } else {
                [this.roleGroup1, this.roleGroup2].forEach(function(group) {
                    this.activeRoleGroup(group);
                });
            }
        },
        // 攻击
        attack: function(role, vector) {
            // TODO 判断攻击合法性
            // 判断是否为该回合激活的角色
            // 判断是否攻击已超时

            // 更新攻击数据
            var weapon = this.get(role.weapon);
            this.attacking = {
                // 进攻的角色
                role: role,
                // 攻击参数
                vector: vector,
                // 复制角色的武器
                // TODO 待更新为工厂方法创建
                weapon: this.create(Stone.type, weapon)
            };

            // 切换到攻击状态
            this.changeState('attack');
        },
        // 攻击结束
        attackFinish: function(weapon) {
            log('director', 'attackFinish', weapon);
            // 切换到攻击准备状态
            this.changeState('ready');
        },

        // 游戏逻辑
        start: function (opts) {
            log('director', 'start', opts);
            // 初始化各元素
            var that = this,
                scene = this.scene = this.create(Scene.type, {}),
                timer = this.timer = this.create(Timer.type, {}),
                stage = this.stage = this.create(Stage.type, {}),
                roleGroup1 = this.roleGroup1 = [],
                roleGroup2 = this.roleGroup2 = [],
                role1x = 100,
                role1y = 540,
                role2x = 920,
                role2y = 540,
                weapon1 = this.create(Stone.type, {
                    x: role1x + 40,
                    y: role1y - 20
                }),
                role1 = this.create(Squirrel.type, {
                    x: role1x,
                    y: role1y,
                    weapon: weapon1.uuid
                }),
                weapon2 = this.create(Stone.type, {
                    x: role2x - 40,
                    y: role2y - 20
                }),
                role2 = this.create(Squirrel.type, {
                    x: role2x,
                    y: role2y,
                    weapon: weapon2.uuid
                });

            // 创建玩家一角色
            // TODO 待更新为工厂方法创建
            roleGroup1.push(role1);

            // 创建玩家二角色
            // TODO 待更新为工厂方法创建
            roleGroup2.push(role2);

            // 监听计时器运行状态
            timer.onStateChange('stop', function() {
                that.assertTimeout();
            });

            // 把元素放置到场景上
            scene.addChild(stage, 1);
            scene.addChild(role1, 2);
            scene.addChild(role2, 3);

            // 游戏状态修改为准备
            this.changeState('ready');
        },
        stop: function () {
            log('director', 'stop');
            var scene = this.scene;
            scene.changeState('freeze');
        },
        show: function() {

        },
        hide: function() {

        },
        // 判定胜利
        assertWin: function() {
            log('director', 'assertWin');
        },
        // 判定超时
        assertTimeout: function() {
            // 计时器停止，如非正在攻击，则进入下回合
            if (this.state !== 'attack') {
                log('director', 'timeout');
                this.changeState('ready');
            }
        },
        stateHandler: {
            ready: {
                init: function() {

                },
                main: function() {
                    // 进入下一回合
                    // 增加回合数
                    this.round++;
                    log('director', 'round', this.round);

                    // 判断回合方
                    this.side = this.round % 2;

                    // 激活该回合角色
                    var activeGroup = this.side === 1 ? this.roleGroup1 : this.roleGroup2,
                        idleGroup = this.side === 1 ? this.roleGroup2 : this.roleGroup1;
                    this.activeRoleGroup(activeGroup);
                    this.idleRoleGroup(idleGroup);

                    // 变更回合方
                    this.scene.changeSide(this.side);

                    // 场景切换到就绪状态
                    this.scene.changeState('ready');
                    // 计时器开始
                    this.timer.changeState('timing');
                },
                exit: function() {

                }
            },
            attack: {
                init: function() {
                    // 清除攻击定时器
                    clearTimeout(this.attackTimer);
                    // 场景切换到攻击状态
                    this.scene.changeState('attack');
                    // 计时器停止
                    this.timer.changeState('stop');
                    // 准备发射武器
                    var that = this,
                        vector = this.attacking.vector,
                        weapon = this.attacking.weapon;
                    // 发射武器
                    weapon.fire(vector);
                },
                main: function() {
                    var that = this,
                        weapon = this.attacking.weapon,
                        outOfStage = false,
                        weaponSleep = false;

                    // 更新 Box2D 世界状态
                    this.updateWorld();

                    // 更新武器位置
                    weapon.updatePosition();

                    // TODO-box2d 判断是否飞出屏幕

                    // TPDO-box2d 判断武器是否睡眠

                    // 攻击未结束前，持续更新
                    this.attackTimer = setTimeout(function() {
                        if (that.state === 'attack') {
                            that.changeState('attack');
                        }
                    }, config.frameInterval);
                },
                exit: function() {
                    // 清除攻击定时器
                    clearTimeout(this.attackTimer);
                    // 移除武器
                    var weapon = this.attacking.weapon;
                    weapon.destroy();
                    // 移除攻击信息
                    this.attacking = null;
                    // 判断胜负
                    this.assertWin();
                }
            },
            freeze: {
                init: function() {

                },
                main: function() {

                },
                exit: function() {
                    
                }
            }
        },

        // 物理世界
        // Box2d 相关
        initWorld: function() {
            var that = this,
                impact = this.impact;

            // 创建新世界
            this.world = new b2World(
                new b2Vec2(0, config.world.gravity), // 重力
                true // allow sleep
            );
            // Enable/disable warm starting. For testing.
            this.world.SetWarmStarting(true);

            // 创建碰撞监听器
            var listener = new b2Listener,
                getElements = function(contact) {
                    var data1 = contact.GetFixtureA().GetBody().GetUserData(),
                        data2 = contact.GetFixtureB().GetBody().GetUserData();
                    return [that.get(data1.uuid), that.get(data2.uuid)];
                };
            // 碰撞开始
            // Called when two fixtures begin to touch.
            listener.BeginContact = function(contact) {
                var elements = getElements(contact);
                elements.forEach(function(element) {
                    if (isRole(element)) {
                        impact.fire('impact:start', [element]);
                    }
                });
            };
            // 碰撞结束
            // Called when two fixtures cease to touch.
            listener.EndContact = function(contact) {
                var elements = getElements(contact);
                elements.forEach(function(element) {
                    if (isRole(element)) {
                        impact.fire('impact:end', [element]);
                    }
                });
            };
            // 碰撞
            // This lets you inspect a contact after the solver is finished.
            listener.PostSolve = function(contact, impulse) {
                var elements = getElements(contact),
                    normalImpulses = impulse.normalImpulses, // 普通冲量向量
                    force = normalImpulses[0]; // 撞击力量
                elements.forEach(function(element) {
                    if (isRole(element)) {
                        // impact.fire('impact:impact', [element, force]);
                        element.impact(force);
                    }
                });
            };
            // This is called after a contact is updated.
            listener.PreSolve = function(contact, oldManifold) {
                // PreSolve
            };
            // 设置世界碰撞监听器
            this.world.SetContactListener(listener);

            // 配置调试绘制
            var debugDraw = new b2DebugDraw();
            // 绘制对象
            debugDraw.SetSprite(document.getElementById("debug").getContext("2d"));
            // 设置边框厚度
            debugDraw.SetLineThickness(1.0);
            // 边框透明度
            debugDraw.SetAlpha(1.0);
            // 填充透明度
            debugDraw.SetFillAlpha(0.4);
            // 设置显示对象
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
            // 物理世界缩放
            debugDraw.SetDrawScale(config.world.scale);
            this.world.SetDebugDraw(debugDraw);

            return this.world;
        },
        // 更新和绘制世界
        updateWorld: function() {
            // Take a time step. This performs collision detection, integration, and constraint solution.
            this.world.Step(
                1 / config.frameRate, //frame-rate 帧率
                10, //velocity iterations 速率
                10  //position iterations
            );
            // 绘制调试数据
            this.world.DrawDebugData();
            // 绘制完毕后清除外力，提高效率
            this.world.ClearForces();
        }
    });

    return Director;
});