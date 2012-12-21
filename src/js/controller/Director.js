/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../model/mixin/EventMixin.js
 * @import ../model/mixin/MessageMixin.js
 * @import ../model/mixin/StateMixin.js
 * @import ../model/Scene.js
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
    'FS::Model::Stage',
    'FS::Model::Role',
    'FS::Model::Squirrel',
    'FS::Model::Weapon',
    'FS::Model::Stone'
], function (_, async, eventMixin, messageMixin, stateMixin, Scene, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var hasOwn = Object.prototype.hasOwnProperty,
        uuid = 0,
        director = _.extend({}, eventMixin, messageMixin);

    // 为类添加工厂方法
    function create(opts) {
        var instance;

        opts = opts || {};
        opts.id = 'i' + (++uuid);

        instance = new this(opts);
        log('director', instance.type + '.create', opts.id, opts);
        director.fire(instance.type, ['create', opts]);

        return instance;
    }

    [Scene, Stage, Role, Squirrel, Weapon, Stone].forEach(function (Class) {
        Class.create = create;
    });

    // 方法分发器
    function dispactor() {
        var slice = Array.prototype.slice,
            action = arguments[0];
        action = action && this[action];
        typeof action === 'function' && action.apply(this, slice.call(arguments, 1));
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
                stage = scene.stage = Stage.create({}),
                roleGroup1 = scene.roleGroup1 = [],
                roleGroup2 = scene.roleGroup2 = [];

            // 创建玩家一角色
            roleGroup1.push(Squirrel.create({
                weapon: Weapon.create({})
            }));

            // 创建玩家二角色
            roleGroup2.push(Squirrel.create({
                weapon: Weapon.create({})
            }));

            // 把元素放置到舞台上
            scene.append(stage, roleGroup1, roleGroup2);
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