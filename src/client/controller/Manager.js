/**
 * Manager
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../../common/Config.js
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
    'FS::Config',
    'FS::Util',
    'FS::Model::Menu',
    'FS::Model::Scene',
    'FS::Model::Splash',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin'
], function (_, async, config, util, Menu, Scene, Splash, eventMixin, messageMixin) {
    'use strict';

    var slice = Array.prototype.slice,
        manager = {
            mix: util.mix
        },
        Classes = {};

    manager.mix(eventMixin, messageMixin);

    manager.listenView('mode', function (mode) {
        log('manager', 'mode', mode);
        manager.mode = mode;
        manager.sendMessage('mode', [mode]);
    });

    manager.listenView('player', function() {
        manager.players = slice.call(arguments);
        manager.players.forEach(function(player) {
            // 把玩家信息送出去
            log('manager', 'player', player);
            manager.sendMessage('player', [player]);
        });
    });

    manager.listenView('game', function (action, uuid) {
        log('manager', 'game', action, uuid);
        switch(action) {
            case 'startup':
                manager.splash.hide();
                manager.menu.replace();
                break;

            case 'start':
                break;

            case 'ready':

                break;

            case 'exit':
                break;

            case 'stop':
                manager.menu.replace();
                break;

            case 'restart':
                break;
        }
        manager.sendMessage('game', [action, uuid]);
    });

    manager.listenView('round', function (action, uuid) {
        log('manager', 'round', action, uuid);
        manager.sendMessage('round', [action, uuid]);
    });

    manager.listenMessage('game', function (action) {
        switch(action) {
            case 'ready':
                log('manager', 'sendMessage', 'scene.replace');
                manager.scene.replace();
                break;

            case 'error':
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
    };

    return manager;
});