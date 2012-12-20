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
    'FS::View::Weapon'
], function (_, async, eventMixin, splash, mainMenu, stateMixin, Scene, Stage, Role, Weapon) {
    'use strict';

    var view = {};

    // 把事件 mixin
    _.extend(view, eventMixin);

    // 为类添加工厂方法
    [Scene, Stage, Role, Weapon].forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            log('view', Class.type + '.create', opts.uuid, opts);
            return new this(opts);
        };
    });

    view.init = function() {
        log('view', 'init');
    };

    return view;
});