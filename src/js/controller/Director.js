/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import Messager.js
 * @import ../model/mixin/EventMixin.js
 * @import ../model/mixin/StateMixin.js
 * @import ../model/Scene.js
 * @import ../model/Stage.js
 * @import ../model/role/Role.js
 * @import ../model/weapon/Weapon.js
 */
elf.define('FS::Controller::Director', [
    'lang',
    'async',
    'FS::Controller::Messager',
    'FS::Model::EventMixin',
    'FS::Model::StateMixin',
    'FS::Model::Scene',
    'FS::Model::Stage',
    'FS::Model::Role',
    'FS::Model::Weapon'
], function (_, async, messager, eventMixin, stateMixin, Scene, Stage, Role, Weapon) {
    'use strict';

    var hasOwn = Object.prototype.hasOwnProperty,
        uuid = 0,
        director = _.extend({}, eventMixin);

    // 为类添加工厂方法
    function create(opts) {
        var instance;

        opts = opts || {};
        opts.id = String(++uuid);

        instance = new this(opts);
        director.fire(instance.type, ['create', opts]);

        log('director', instance.type + '.create', uuid, opts);
        return instance;
    }

    [Scene, Stage, Role, Weapon].forEach(function (Class) {
        Class.create = create;
    });

    // 方法分发器
    function dispactor() {
        var action = arguments[0];
        action = action && director[action];
        typeof action === 'function' && action.apply(director, arguments);
    }

    director = _.extend(director, {
        init: function (opts) {
            var options = this.options = _.extend({}, opts);
            options.mode = options.mode === 'master' ? 'master' : 'slave';
            this.on();
        },

        // 事件相关
        on: function () {
            messager.bind('director', dispactor.bind(this));
        },
        off: function () {
            messager.unbind('director');
        }

        // 游戏逻辑
        start: function (opts) {
            // TODO: 处理 opts，根据 opts 实例化具体代码。
            var scene = this.scene = game.scene = Scene.create({}),
                roleGroup = scene.roleGroup = [];

            scene.stage = Stage.create({});
            roleGroup.push(Role.create({
                weapon: Weapon.create({})
            }));

            scene.changeState('ready');
        },
        stop: function () {
            // TODO: this.scene.over();
            this.scene = null;
        }
    });

    return director;
});