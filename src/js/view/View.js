/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import mixin/EventMixin.js
 * @import Splash.js
 * @import menu/ExitMenu.js
 * @import menu/GameMenu.js
 * @import menu/MainMenu.js
 * @import menu/ResultMenu.js
 * @import Scene.js
 * @import Timer.js
 * @import Stage.js
 * @import role/Role.js
 * @import role/Squirrel.js
 * @import weapon/Weapon.js
 * @import weapon/Stone.js
 */
elf.define('FS::View::View', [
    'lang',
    'async',
    'FS::View::EventMixin',
    'FS::View::Splash',
    'FS::View::ExitMenu',
    'FS::View::GameMenu',
    'FS::View::MainMenu',
    'FS::View::ResultMenu',
    'FS::View::Scene',
    'FS::View::Timer',
    'FS::View::Stage',
    'FS::View::Role',
    'FS::View::Squirrel',
    'FS::View::Weapon',
    'FS::View::Stone'
], function (_, async, eventMixin, splash, exitMenu, gameMenu, mainMenu, resultMenu, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var view = _.extend({}, eventMixin),
        Classes = [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone],
        elements = {};

    // 为类添加工厂方法
    Classes.forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            if (!opts) {
                return;
            }
            log('view', Class.type + '.create', opts.uuid, opts);
            var instance = new this(opts);
            elements[opts.uuid] = instance;
            return instance;
        };
        view.bind(Class.type, function(action, opts) {
            if (action === 'create') {
                Class.create(opts);
            }
        });
    });

    view.init = function() {
        log('view', 'init');
    };

    return view;
});