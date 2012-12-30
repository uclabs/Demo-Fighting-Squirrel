/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../Config.js
 * @import ../Util.js
 * @import ./Resources.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/MessageMixin.js
 * @import ./scene/Menu.js
 * @import ./scene/Scene.js
 * @import ./scene/Splash.js
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
    'FS::Util',
    'FS::View::Resources',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::Menu',
    'FS::View::Scene',
    'FS::View::Splash',
    'FS::View::Timer',
    'FS::View::Stage',
    'FS::View::Role',
    'FS::View::Squirrel',
    'FS::View::Weapon',
    'FS::View::Stone'
], function (_, async, config, util, resources, eventMixin, messageMixin, Menu, Scene, Splash, Timer, Stage, Role, Squirrel, Weapon, Stone) {
    'use strict';

    var view = {
                elements: {},
                mix: util.mix
            },
        Classes = [Menu, Scene, Splash, Timer, Stage, Role, Squirrel, Weapon, Stone],
        Cocos2dApp, cocos2dApp;

    // 把事件和消息 mixin
    view.mix(eventMixin, messageMixin);

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
            instance.elements = view.elements;
            view.elements[opts.uuid] = instance;

            return instance;
        };
        view.listenController(Class.type, function (action, opts) {
            if (action === 'create') {
                Class.create(opts);
            }
        });
    });

    // Cocos2d Application
    Cocos2dApp = cc.Application.extend({
        config: config.ccConfig,
        mix: util.mix,
        ctor: function (scene) {
            var that = this;
            this._super();
            this.mix(messageMixin);
            this.mix(eventMixin);
            this.startScene = scene;
            cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
            cc.setup(this.config.tag);
            cc.Loader.getInstance().onloading = function () {
                cc.LoaderScene.getInstance().draw();
            };
            cc.Loader.getInstance().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
                that.sendController('cocos2d_onload');
            };
            cc.Loader.getInstance().preload(resources.ccRessources);
        },
        applicationDidFinishLaunching: function () {
            // initialize director
            var director = cc.Director.getInstance();
            var scene = new cc.Scene();

            // run
            director.runWithScene(scene);
            return true;
        }
    });

    view.init = function () {
        // 监听 Scene 创建
        /*this.listenMessage('Scene:create', function () {
            if (!cocos2dApp) {
                log('view:cocos2d', 'app');
                cocos2dApp = new Cocos2dApp();
            }
        });*/
        log('view', 'init');
        if (!cocos2dApp) {
            cocos2dApp = new Cocos2dApp();
        }
        // cocos2dOnload: function(){
        //     this.
        // }

    };
    return view;
});