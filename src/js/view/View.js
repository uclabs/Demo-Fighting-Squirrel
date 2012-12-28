/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ./Resources.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/MessageMixin.js
 * @import ./Splash.js
 * @import ./menu/ExitMenu.js
 * @import ./menu/GameMenu.js
 * @import ./menu/MainMenu.js
 * @import ./menu/ResultMenu.js
 * @import ./Scene.js
 * @import ./Timer.js
 * @import ./Stage.js
 * @import ./role/Role.js
 * @import ./role/Squirrel.js
 * @import ./weapon/Weapon.js
 * @import ./weapon/Stone.js
 */
elf.define('FS::View::View', [
    'lang',
    'async',
    'FS::Config',
    'FS::View::Resources',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
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
], function (_, async, config, resources, eventMixin, messageMixin, splash, exitMenu, gameMenu, mainMenu, resultMenu, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var view = _.extend({
                elements: {}
            }, eventMixin, messageMixin),
        Classes = [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone],
        Cocos2dApp, cocos2dApp;

    // 为类添加工厂方法
    Classes.forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            if (!opts) {
                return;
            }

            // 把uuid替换成物体
            for (var name in opts) {
                var value = opts[name],
                    element = view.elements[value];
                if (element) {
                    opts[name] = element;
                }
            }

            log('view', Class.type + '.create', opts.uuid, opts);
            var instance = new Class(opts);
            view.elements[opts.uuid] = instance;

            return instance;
        };
        view.listenController(Class.type, function(action, opts) {
            if (action === 'create') {
                Class.create(opts);
            }
        });
    });

    // Cocos2d Application
    Cocos2dApp = cc.Application.extend({
        config: config.ccConfig,
        ctor: function (scene) {
            this._super();
            this.startScene = scene;
            cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
            cc.setup(this.config.tag);
            cc.Loader.getInstance().onloading = function () {
                cc.LoaderScene.getInstance().draw();
            };
            cc.Loader.getInstance().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            cc.Loader.getInstance().preload(resources.ccRessources);
        },
        applicationDidFinishLaunching: function () {
            // initialize director
            var director = cc.Director.getInstance();
            var scene = cc.Scene.create();
            // run
            director.runWithScene(scene);
            return true;
        }
    });

    view.init = function() {
        // 监听 Scene 创建
        this.listenMessage('Scene:create', function() {
            if (!cocos2dApp) {
                log('view:cocos2d', 'app');
                cocos2dApp = new Cocos2dApp();
            }
        });
        log('view', 'init');
    };

    return view;
});