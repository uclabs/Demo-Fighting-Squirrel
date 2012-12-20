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

    var uuid = 0,
        director = {
            options: {
                mode: 'master' // master | slave
            }
        };

    // 把事件和状态 mixin
    _.extend(director, eventMixin, stateMixin);

    // 为类添加工厂方法
    [Scene, Stage, Role, Weapon].forEach(function (Class) {
        Class.create = Class.create || function (opts) {
            opts = opts || {};
            opts.id = String(++uuid);
            log(Class.type, 'create', uuid);
            return new this(opts);
        };
    });

    messager.bind('director', function(action) {
        log('director', 'bind', action);
        switch(action) {
            case 'start':
                start();
                break;

            case 'stop':
                stop();
                break;

            case 'restart':
                restart();
                break;

            case 'config':
                config();
                break;

            case 'show':
                show();
                break;

            case 'hide':
                hide();
                break;
        }
    });

    var scene, stage,
        weapon1, role1,
        weapon2, role2;
    function start() {
        log('director', 'start');
        scene = Scene.create({});
        stage = Stage.create({});
        weapon1 = Weapon.create({});
        role1 = Role.create({weapon: weapon1});
        weapon2 = Weapon.create({});
        role2 = Role.create({weapon: weapon2});
    };

    function stop() {
        
    };

    function restart() {
        
    };

    function config() {
        
    };

    function show() {
        
    };

    function hide() {
        
    };

    director.init = function init() {
        log('director', 'init');
    };

    // director.stateHandler = {
    //     init: function() {

    //     },
    //     start: {
    //         init: function () {},
    //         main: function () {},
    //         exit: function () {}
    //     },
    //     stop: {
    //         init: function () {},
    //         main: function () {},
    //         exit: function () {}
    //     },
    //     restart: {
    //         init: function () {},
    //         main: function () {},
    //         exit: function () {}
    //     }
    // };

    return director;
});