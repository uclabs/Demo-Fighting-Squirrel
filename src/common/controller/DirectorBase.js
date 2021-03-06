/**
 * DirectorBase
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
 * @import ../model/Player.js
 * @import ../model/Timer.js
 * @import ../model/Stage.js
 * @import ../model/role/Role.js
 * @import ../model/role/Squirrel.js
 * @import ../model/weapon/Weapon.js
 * @import ../model/weapon/Stone.js
 */
elf.define('FS::Controller::DirectorBase', [
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
    'FS::Model::Player',
    'FS::Model::Timer',
    'FS::Model::Stage',
    'FS::Model::Role',
    'FS::Model::Squirrel',
    'FS::Model::Weapon',
    'FS::Model::Stone'
], function (_, Event, Class, async, Box2D, config, util, eventMixin, messageMixin, stateMixin, Player, Timer, Stage, Role, Squirrel, Weapon, Stone) {
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
        isSame = util.isSame,

        // 游戏相关定义
        Classes = {};

    [Player, Timer, Stage, Role, Squirrel, Weapon, Stone].forEach(function (Class) {
        Classes[Class.type] = Class;
        Class.create = Class.create || function (opts) {
            opts = opts || {};
            // 如果是玩家，并且玩家已经携带了uuid，就不再重新生成UUID了
            if (!(Class.type === Player.type && opts.uuid)) {
                opts.uuid = util.uuid();
            }
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

    var DirectorBase = Class.extend({
        // 配置属性
        players: null,

        // 游戏状态
        elements: {}, // 元素们
        side: 0, // 回合方
        round: 0, // 当前回合数
        attacking: {
            role: null, // 进攻角色
            weapon: null, // 武器
            force: null // 攻击力量
        },

        // 混入方法
        mix: util.mix,
        // 构造函数
        ctor: function (opts) {
            log('director', 'init', opts);
            // 玩家列表
            this.players = [];
            // 随机一方开始
            this.side = Math.round(Math.random());

            this.mix(eventMixin, messageMixin, stateMixin);
            this.config(opts);

            // 创建 Box2d 的物理世界
            this.initWorld();

            // 监听其他消息
            this.listenMessage('mode', this.onModeChange.bind(this));
            this.listenMessage('player', this.onPlayerChange.bind(this));
            this.listenMessage('game', this.onGameChange.bind(this));
            this.listenMessage('round', this.onRoundChange.bind(this));
            this.listenMessage(Role.type, this.onRole.bind(this));
            this.listenMessage(Weapon.type, this.onWeapon.bind(this));
        },
        config: function (opts) {
            log('director', 'config', opts);
            _.extend(true, this, opts);
        },

        // 元素创建工厂
        create: function (type, opts) {
            var Class = Classes[type];
            if (Class) {
                opts = opts || {};
                opts.world = this.world;

                var instance = Class.create(opts);
                // 添加入元素列表中
                this.add(opts.uuid, instance);
                // 向 view 派发创建指令
                log('director', instance.type + '.create', opts.uuid, opts);
                this.sendView(instance.type, ['create', instance.config()]);

                return instance;
            }
        },
        // 把元素加入列表中
        add: function (uuid, element) {
            this.elements[uuid] = element;
        },
        // 获取元素
        get: function (uuid) {
            return this.elements[uuid];
        },

        // 游戏模式改变
        onModeChange: function(mode) {
            
        },
        // 玩家改变
        onPlayerChange: function(opts) {
            if (!opts) {
                opts = {};
            }
            opts.side = this.players.length;
            var player = this.create(Player.type, opts);
            this.players.push(player);
        },
        // 游戏改变
        onGameChange: function(action, uuid) {
            if (!uuid) {
                return;
            }
            var flags = {
                    'start': 'isGameStart',
                    'ready': 'isGameReady'
                },
                flag = flags[action],
                allAllow = true;
            this.players.forEach(function(player) {
                if (player.uuid === uuid) {
                    player[flag] = true;
                } else if (!player[flag]) {
                    allAllow = false;
                }
            });
            if (!allAllow) {
                return;
            }
            switch(action) {
                case 'start':
                    this.gameInit();
                    break;

                case 'ready':
                    this.gameStart();
                    break;

                case 'stop':
                    this.gameStop();
                    break;
            }
        },
        // 回合变更
        onRoundChange: function(action, uuid) {
            if (!uuid) {
                return;
            }
            var flags = {
                    'ready': 'isRoundReady'
                },
                flag = flags[action],
                allAllow = true;
            this.players.forEach(function(player) {
                if (player.uuid === uuid) {
                    player[flag] = true;
                } else if (!player[flag]) {
                    allAllow = false;
                }
            });
            if (!allAllow) {
                return;
            }
            switch(action) {
                case 'ready':
                    // 计时器开始
                    this.timer.changeState('timing');
                    break;
            }
        },

        // 角色响应方法
        onRole: function (uuid, action) {
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
        onWeapon: function (uuid, action) {
            var args = slice.call(arguments, 2),
                weapon = this.get(uuid);
            args.unshift(weapon);
        },

        // 冻结
        freeze: function () {
            this.freezeRoleGroup();
        },
        // 冻结角色
        idleRoleGroup: function (roleGroup) {
            if (roleGroup) {
                roleGroup.forEach(function (role) {
                    role.changeState('idle');
                });
            } else {
                this.players.forEach(function (player) {
                    var roles = player.roles;
                    this.freezeRoleGroup(roles);
                });
            }
        },
        activeRoleGroup: function (roleGroup) {
            if (roleGroup) {
                roleGroup.forEach(function (role) {
                    role.changeState('active');
                });
            } else {
                this.players.forEach(function (player) {
                    var roles = player.roles;
                    this.activeRoleGroup(roles);
                });
            }
        },
        // 攻击
        attack: function (role, vector) {
            // TODO 判断攻击合法性
            if (!role || !vector) {
                return;
            }

            var player = this.players[this.side],
                roles = player.roles,
                isActiveRole = false;

            // 判断是否为该回合激活的角色
            roles.forEach(function(r) {
                if (isSame(role, r)) {
                    isActiveRole = true;
                }
            });
            if (!isActiveRole) {
                log('director', 'attack', 'not active role');
                return;
            }

            // 判断是否攻击已超时
            if (this.timer.state !== 'timing') {
                log('director', 'attack', 'timeout');
                return;
            }

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

        addChild: function(child, index) {
            var uuid = _.type(child) === 'object' ? child.uuid : child;
            this.sendMessage('scene', ['addChild', uuid, index]);
        },

        // 游戏初始化
        gameInit: function (opts) {
            log('director', 'gameInit', opts);
            var that = this,
                players = this.players,
                timer = this.timer = this.create(Timer.type, {}),
                stage = this.stage = this.create(Stage.type, {});

            that.addChild(stage);

            players.forEach(function(player, index) {
                var side = config.side[index],
                    weapon = that.create(Stone.type, {
                        player: player.uuid,
                        x: side.wx,
                        y: side.wy
                    }),
                    role = that.create(Squirrel.type, {
                        player: player.uuid,
                        x: side.x,
                        y: side.y,
                        weapon: weapon.uuid
                    });
                that.addChild(role);
                player.roles = [role];

                // 将玩家标记为未准备好
                player.isGameReady = false;
                player.gameReady();
            });

            // 监听计时器运行状态
            timer.onStateChange('stop', function () {
                that.assertTimeout();
            });
        },
        // 游戏开始
        gameStart: function() {
            log('director', 'gameStart');
            // 游戏状态修改为准备
            this.changeState('ready');
        },
        // 游戏结束
        gameStop: function () {
            log('director', 'gameStop');
        },

        show: function () {

        },
        hide: function () {

        },

        // 判定胜利
        assertWin: function () {
            log('director', 'assertWin');
        },
        // 判定超时
        assertTimeout: function () {
            // 计时器停止，如非正在攻击，则进入下回合
            if (this.state !== 'attack') {
                log('director', 'timeout');
                this.changeState('ready');
            }
        },

        stateHandler: {
            ready: {
                init: function () {
                },
                main: function () {
                    // 如果计时器还在跑，则表明回合未结束
                    if (this.timer.state === 'timing') {
                        return;
                    }

                    // 等待玩家响应回合开始
                    this.players.forEach(function(player) {
                        player.isRoundReady = false;
                    });

                    // 进入下一回合
                    // 增加回合数
                    this.round++;
                    log('director', 'round', this.round);

                    // 判断回合方
                    this.side = this.round % 2;
                    
                    // 激活该回合角色
                    var activeSide = this.side,
                        idleSide = this.side === 0 ? 1 : 0,
                        activeRoles = this.players[activeSide].roles,
                        idleRoles = this.players[idleSide].roles;
                    this.activeRoleGroup(activeRoles);
                    this.idleRoleGroup(idleRoles);

                    // 变更回合方
                    this.sendMessage('scene', ['changeSide', this.side]);

                    // 场景切换到就绪状态
                    this.sendMessage('scene', ['changeState', 'ready']);

                    // 重置计时器
                    this.timer.reset();
                },
                exit: function () {

                }
            },
            attack: {
                init: function () {
                    // 清除攻击定时器
                    clearInterval(this.attackTimer);
                    // 场景切换到攻击状态
                    this.sendMessage('scene', ['changeState', 'attack']);
                    // 计时器停止
                    this.timer.changeState('stop');
                    // 准备发射武器
                    var that = this,
                        vector = this.attacking.vector,
                        weapon = this.attacking.weapon;
                    // 监听武器状态
                    weapon.onStateChange('idle', function() {
                        // 切换到攻击准备状态
                        that.changeState('ready');
                    });
                    // 发射武器
                    weapon.fire(vector);
                    // 将所有元素的武器置空，受到撞击的力量置0
                    for (var uuid in this.elements) {
                        var element = this.elements[uuid];
                        element.impactWeapon = null;
                        element.impactForce = 0;
                    }
                },
                main: function () {
                    var that = this,
                        weapon = this.attacking.weapon;

                    // 攻击未结束前，持续更新
                    this.attackTimer = setInterval(function () {
                        // 更新 Box2D 世界状态
                        that.updateWorld();
                        // 更新武器位置
                        weapon.updatePosition();
                    }, config.frameInterval);
                },
                exit: function () {
                    // 清除攻击定时器
                    clearInterval(this.attackTimer);
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
                init: function () {

                },
                main: function () {

                },
                exit: function () {
                    
                }
            }
        },

        // 物理世界
        // Box2d 相关
        initWorld: function () {
            var that = this;

            // 创建新世界
            this.world = new b2World(
                new b2Vec2(0, config.world.gravity), // 重力
                true // allow sleep
            );
            // Enable/disable warm starting. For testing.
            this.world.SetWarmStarting(true);

            // 创建碰撞监听器
            var listener = new b2Listener,
                getElements = function (contact) {
                    var data0 = contact.GetFixtureA().GetBody().GetUserData(),
                        data1 = contact.GetFixtureB().GetBody().GetUserData();
                    return [that.get(data0.uuid), that.get(data1.uuid)];
                };
            // 碰撞开始
            // Called when two fixtures begin to touch.
            listener.BeginContact = function (contact) {
                var elements = getElements(contact);
                elements.forEach(function (element) {
                    if (isWeapon(element)) {
                    }
                });
            };
            // 碰撞结束
            // Called when two fixtures cease to touch.
            listener.EndContact = function (contact) {
                var elements = getElements(contact);
                elements.forEach(function (element) {
                    if (isRole(element)) {
                    }
                });
            };
            // 碰撞
            // This lets you inspect a contact after the solver is finished.
            listener.PostSolve = function (contact, impulse) {
                var elements = getElements(contact),
                    normalImpulses = impulse.normalImpulses, // 普通冲量向量
                    force = normalImpulses[0], // 撞击力量
                    role = null,
                    weapon = null;
                elements.forEach(function (element) {
                    if (isRole(element)) {
                        role = element;
                    } else if (isWeapon(element)) {
                        weapon = element;
                    }
                });
                if (role && weapon &&
                    (!role.impactForce || role.impactForce < force)) {
                    log('impact', role.uuid, force);
                    role.impactForce = force;
                }
            };
            // This is called after a contact is updated.
            listener.PreSolve = function (contact, oldManifold) {
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
        updateWorld: function () {
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

    return DirectorBase;
});