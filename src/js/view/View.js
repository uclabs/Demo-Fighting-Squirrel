/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import Resources.js
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
    'FS::Config',
    'FS::View::Resources',
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
], function (_, async, config, resources, eventMixin, splash, exitMenu, gameMenu, mainMenu, resultMenu, Scene, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var view = _.extend({
                elements: {}
            }, eventMixin),
        Classes = [Scene, Timer, Stage, Role, Squirrel, Weapon, Stone],
        cocos2dApp;

    // 为类添加工厂方法
    Classes.forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            if (!opts) {
                return;
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

    //创建Application
    cocos2dApp = cc.Application.extend({
        config: config.ccConfig,
        ctor:function (scene) {
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
        applicationDidFinishLaunching:function () {
            // initialize director
            var director = cc.Director.getInstance();

            // run
            director.runWithScene(new this.startScene());

            return true;
        }
    });


    view.init = function() {
        log('view', 'init');
    };

    return view;
});