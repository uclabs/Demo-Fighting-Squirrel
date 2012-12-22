/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
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
], function (_, async, eventMixin, messageMixin, stateMixin, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var uuid = 0,
        director = _.extend({}, eventMixin, messageMixin);

    // 为类添加工厂方法
    function create(opts) {
        opts = opts || {};
        opts.uuid = 'i' + (++uuid);

        var instance = new this(opts);
        log('director', instance.type + '.create', opts.uuid, opts);
        director.fire(instance.type, ['create', opts]);

        return instance;
    }

    [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone].forEach(function (Class) {
        Class.create = create;
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
        player1: {
            race: ''
        },
        player2: {
            race: ''
        },

        init: function (opts) {
            log('director', 'init', opts);
            this.config(opts);
            this.listenMessage('director', dispactor.bind(this));
        },
        config: function(opts) {
            log('director', 'config', opts);
            _.extend(true, this, opts);
        },

        // 游戏逻辑
        start: function (opts) {
            log('director', 'start', opts);
            // TODO: 处理 opts，根据 opts 实例化具体代码。
            var scene = this.scene = Scene.create({}),
                timer = Timer.create({}),
                stage = scene.stage = Stage.create({}),
                roleGroup1 = scene.roleGroup1 = [],
                roleGroup2 = scene.roleGroup2 = [];

            // 创建玩家一角色
            roleGroup1.push(Squirrel.create({
                x: 50,
                y: 120,
                weapon: Stone.create({})
            }));

            // 创建玩家二角色
            roleGroup2.push(Squirrel.create({
                x: 950,
                y: 120,
                weapon: Stone.create({})
            }));

            // 监听场景状态切换
            scene.stateChange('ready', function() {
                // 场景准备完毕，开始计时
                timer.changeState('timing');
            });

            // 监听计时器运行状态
            timer.stateChange('stop', function() {
                // 计时器停止，如非正在攻击，则进入下回合
                if (scene.state !== 'attack') {
                    scene.changeState('ready');
                }
            });

            // 把元素放置到舞台上
            scene.append(stage, roleGroup1, roleGroup2);

            // 场景准备完毕，游戏开始
            scene.changeState('ready');
        },
        stop: function () {
            log('director', 'stop');
            // TODO: this.scene.over();
            var scene = this.scene;
            scene = null;
        },
        show: function() {

        },
        hide: function() {

        }
    });

    return director;
});