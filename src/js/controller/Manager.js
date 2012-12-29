/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../Util.js
 * @import ../model/scene/Menu.js
 * @import ../model/scene/Scene.js
 * @import ../model/scene/Splash.js
 * @import ../model/mixin/EventMixin.js
 * @import ../model/mixin/MessageMixin.js
 */
elf.define('FS::Controller::Manager', [
    'lang',
    'async',
    'FS::Util',
    'FS::Model::Menu',
    'FS::Model::Scene',
    'FS::Model::Splash',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin'
], function (_, async, util, Menu, Scene, Splash, eventMixin, messageMixin) {
    'use strict';

    var slice = Array.prototype.slice,
        manager = {
            mix: util.mix
        },
        uuid = 0,
        Classes = {},
        menu, scene, splash;

    manager.mix(eventMixin, messageMixin);

    manager.listenView('config', function (opts) {
        log('manager', 'config', opts);
        manager.sendMessage('director', ['config', opts]);
    });

    manager.listenView('game', function (action) {
        switch(action) {
            case 'start':
                log('manager', 'sendMessage', 'director.start');
                manager.sendMessage('director', ['start']);
                break;

            case 'exit':
                log('manager', 'sendMessage', 'director.exit');
                break;

            case 'stop':
                log('manager', 'sendMessage', 'director.stop');
                manager.sendMessage('director', ['stop']);
                menu.replace();
                break;

            case 'restart':
                log('manager', 'sendMessage', 'director.restart');
                manager.sendMessage('director', ['restart']);
                break;
        }
    });

    manager.listenMessage('director', function (state) {
        switch(state) {
            case 'ready':
                log('manager', 'sendMessage', 'scene.replace');
                scene.replace();
                break;
        }
    });

    manager.listenMessage('scene', function(action) {
        var args = slice.call(arguments, 1);
        scene[action].apply(scene, args);
    });

    function init() {
        log('manager', 'init');

        menu = new Menu({uuid: 'menu'});
        log('manager', 'Menu.create', 'menu', menu.config());
        manager.sendView(Menu.type, ['create', menu.config()]);
        
        scene = new Scene({uuid: 'scene'});
        log('manager', 'Scene.create', 'scene', scene.config());
        manager.sendView(Scene.type, ['create', scene.config()]);

        splash = new Splash({uuid: 'splash'});
        log('manager', 'Splash.create', 'splash', splash.config());
        manager.sendView(Splash.type, ['create', splash.config()]);

        // 切换到菜单场景
        menu.replace();
    };

    return {
        init: init
    };
});