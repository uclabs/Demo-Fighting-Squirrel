/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import mixin/EventMixin.js
 */
elf.define('FS::View::View', [
    'lang',
    'async',
    'FS::View::EventMixin',
    'FS::View::Splash',
    'FS::View::MainMenu',
    'FS::View::Scene',
    'FS::View::Stage',
    'FS::View::Role',
    'FS::View::Squirrel',
    'FS::View::Weapon',
    'FS::View::Stone'
], function (_, async, eventMixin, splash, mainMenu, Scene, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var view = _.extend({}, eventMixin),
        Classes = [Scene, Stage, Role, Squirrel, Weapon, Stone],
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