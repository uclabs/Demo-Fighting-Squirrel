/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../lib/elf/mod/async.js
 * @import ../../lib/elf/mod/box2d.js
 * @import ../Config.js
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
    'class',
    'async',
    'box2d',
    'FS::Config',
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
], function (_, Class, async, Box2D, config, eventMixin, messageMixin, stateMixin, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
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
        ctor: function(opts) {
            log('director', 'init', opts);
            this.mix(eventMixin, messageMixin, stateMixin);
            this.config(opts);

            // 创建 Box2d 的物理世界
            this.initWorld();

            this.listenMessage('director', dispactor.bind(this));
            this.listenMessage(Role.type, this.onRole.bind(this));
            this.listenMessage(Weapon.type, this.onWeapon.bind(this));
        },
        mix: function () {
            _.extend.apply(_, concat.apply([true, this], arguments));
        },
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
            switch(action) {
                case 'finish':
                    this.attackFinish.apply(this, args);
                    break;
            }
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

        // 进入下一回合
        nextRound: function() {
            // 增加回合数
            this.round++;
            this.side = this.round % 2;
            log('director', 'nextRound', this.round);
        },
        // 攻击
        attack: function(role, force) {
            // TODO 判断攻击合法性

            // 更新攻击数据
            var weapon = this.get(role.weapon);
            this.attacking = {
                role: role,
                force: force,
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
                weapon1 = this.create(Stone.type, {}),
                weapon2 = this.create(Stone.type, {});

            // 创建玩家一角色
            // TODO 待更新为工厂方法创建
            roleGroup1.push(this.create(Squirrel.type, {
                x: 50,
                y: 120,
                width: 30,
                height: 60,
                weapon: weapon1.uuid
            }));

            // 创建玩家二角色
            // TODO 待更新为工厂方法创建
            roleGroup2.push(this.create(Squirrel.type, {
                x: 950,
                y: 120,
                width: 30,
                height: 60,
                weapon: weapon2.uuid
            }));

            // 监听计时器运行状态
            timer.onStateChange('stop', function() {
                that.assertTimeout();
            });

            // 把元素放置到场景上
            scene.addChild(stage, 1);
            scene.addChild(roleGroup1, 2);
            scene.addChild(roleGroup2, 3);

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
                    this.nextRound();

                    // 激活该回合角色
                    var activeGroup = this.side === 1 ? this.roleGroup1 : this.roleGroup2,
                        idleGroup = this.side === 1 ? this.roleGroup2 : this.roleGroup1;
                    this.activeRoleGroup(activeGroup);
                    this.idleRoleGroup(idleGroup);

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
                        weapon = this.attacking.weapon;
                    // 监听武器状态改变，如果武器停止了就切换到下回合
                    weapon.onStateChange('idle', function() {
                        that.changeState('ready');
                    });
                    // 发射武器
                    weapon.fire();
                },
                main: function() {
                    var that = this;
                    // 更新 Box2D 世界状态
                    this.updateWorld();
                    // 攻击未结束前，持续更新
                    this.attackTimer = setTimeout(function() {
                        if (that.state === 'idle') {
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
            this.world = new b2World(
                new b2Vec2(0, config.world.gravity), // 重力
                true //allow sleep
            );

            // 创建碰撞监听器
            var listener = new b2Listener;
            // 监听碰撞开始
            // Called when two fixtures begin to touch.
            listener.BeginContact = function(contact) {
                console.log('===========BeginContact');
            };
            // 监听碰撞结束
            // Called when two fixtures cease to touch.
            listener.EndContact = function(contact) {
                console.log('===========EndContact');
                //console.log(contact.GetFixtureA().GetBody().GetUserData());
            };
            listener.PostSolve = function(contact, impulse) {
                console.log(impulse.normalImpulses);//法向量?
                /*
                if (contact.GetFixtureA().GetBody().GetUserData() == 'ball' || contact.GetFixtureB().GetBody().GetUserData() == 'ball') {
                    var impulse = impulse.normalImpulses[0];
                    if (impulse < 0.2) return; //threshold ignore small impacts
                    world.ball.impulse = impulse > 0.6 ? 0.5 : impulse;
                    console.log(world.ball.impulse);
                }
                */
            };
            listener.PreSolve = function(contact, oldManifold) {
                // PreSolve
            };
            // 设置世界碰撞监听器
            this.world.SetContactListener(listener);

            //setup debug draw
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(document.getElementById("debug").getContext("2d"));
            // debugDraw.SetDrawScale(SCALE); // 放大，应该可以用来适应屏幕
            debugDraw.SetFillAlpha(0.3); // 透明度
            //debugDraw.SetLineThickness(1.0); // 线粗细
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit); // 不明白干嘛的
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
            this.world.DrawDebugData(); //绘制调试数据
            this.world.ClearForces(); //绘制完毕后清除外力
        }
    });

    return Director;
});