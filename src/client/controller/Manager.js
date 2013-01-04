/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../../common/Util.js
 * @import ../model/scene/Menu.js
 * @import ../model/scene/Scene.js
 * @import ../model/scene/Splash.js
 * @import ../../common/model/mixin/EventMixin.js
 * @import ../../common/model/mixin/MessageMixin.js
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
        Classes = {};

    manager.mix(eventMixin, messageMixin);

    manager.listenView('mode', function (mode) {
        log('manager', 'mode', mode);
        if (mode === 'multi-player') {
            
        } else if (mode === 'online') {
            
        }
        manager.sendMessage('mode', [mode]);
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
                manager.menu.replace();
                break;

            case 'restart':
                log('manager', 'sendMessage', 'director.restart');
                manager.sendMessage('director', ['restart']);
                break;
        }
    });

    manager.listenMessage('game', function (action) {
        switch(action) {
            case 'ready':
                log('manager', 'sendMessage', 'scene.replace');
                manager.scene.replace();
                break;
        }
    });

    manager.listenMessage('scene', function(action) {
        var args = slice.call(arguments, 1);
        manager.scene[action].apply(manager.scene, args);
    });

    manager.init = function () {
        log('manager', 'init');

        this.menu = new Menu({uuid: 'menu'});
        log('manager', 'Menu.create', 'menu', this.menu.config());
        this.sendView(Menu.type, ['create', this.menu.config()]);

        this.scene = new Scene({uuid: 'scene'});
        log('manager', 'Scene.create', 'scene', this.scene.config());
        this.sendView(Scene.type, ['create', this.scene.config()]);

        this.splash = new Splash({uuid: 'splash'});
        log('manager', 'Splash.create', 'splash', this.splash.config());
        this.sendView(Splash.type, ['create', this.splash.config()]);

        // 切换到菜单场景
        setTimeout(function() {
            manager.splash.hide();
            manager.menu.replace();
        }, 1000);
    };

    return manager;
});