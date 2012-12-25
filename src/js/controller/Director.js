/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
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
    'async',
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
], function (_, async, config, eventMixin, messageMixin, stateMixin, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var slice = Array.prototype.slice,
        uuid = 0,
        director = _.extend({}, eventMixin, messageMixin, stateMixin),
        Classes = [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone];

    Classes.forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            opts = opts || {};
            opts.uuid = 'u' + (++uuid);

            var instance = new Class(opts);
            director.add(opts.uuid, instance);

            // 向 view 派发创建指令
            log('director', instance.type + '.create', opts.uuid, opts);
            director.sendView(instance.type, ['create', instance.config()]);

            return instance;
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

    director = _.extend(director, {
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

        init: function (opts) {
            log('director', 'init', opts);
            this.config(opts);
            this.listenMessage('director', dispactor.bind(this));
            this.listenMessage(Role.type, this.onRole.bind(this));
            this.listenMessage(Weapon.type, this.onWeapon.bind(this));
        },
        config: function(opts) {
            log('director', 'config', opts);
            _.extend(true, this, opts);
        },

        // 把元素加入列表中
        add: function(uuid, element) {
            this.elements[uuid] = element;
        },

        // 角色响应方法
        onRole: function(uuid, action) {
            var args = slice.call(arguments, 2),
                role = this.elements[uuid];
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
                weapon = this.elements[uuid];
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
            var weapon = this.elements[role.weapon];
            this.attacking = {
                role: role,
                force: force,
                // 复制角色的武器
                // TODO 待更新为工厂方法创建
                weapon: Stone.create(weapon)
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
                scene = this.scene = Scene.create({}),
                timer = this.timer = Timer.create({}),
                stage = this.stage = Stage.create({}),
                roleGroup1 = this.roleGroup1 = [],
                roleGroup2 = this.roleGroup2 = [],
                weapon1 = Stone.create({}),
                weapon2 = Stone.create({});

            // 创建玩家一角色
            // TODO 待更新为工厂方法创建
            roleGroup1.push(Squirrel.create({
                x: 50,
                y: 120,
                weapon: weapon1.uuid
            }));

            // 创建玩家二角色
            // TODO 待更新为工厂方法创建
            roleGroup2.push(Squirrel.create({
                x: 950,
                y: 120,
                weapon: weapon2.uuid
            }));

            // 监听计时器运行状态
            timer.onStateChange('stop', function() {
                that.assertTimeout();
            });

            // 把元素放置到舞台上
            scene.append(stage, roleGroup1, roleGroup2);

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
                    // 场景切换到攻击状态
                    this.scene.changeState('attack');
                    // 计时器停止
                    this.timer.changeState('stop');
                },
                main: function() {
                    var that = this,
                        weapon = this.attacking.weapon;
                    // 监听武器状态改变，如果武器停止了就切换到下回合
                    weapon.onStateChange('idle', function() {
                        that.changeState('ready');
                    });
                    // 发射武器
                    weapon.fire();
                },
                exit: function() {
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
        }
    });

    return director;
});