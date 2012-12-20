/**
 * Director
 *
 * @import ../Dispatcher.js
 * @import ../model/Scene.js
 * @import ../model/Stage.js
 * @import ../model/role/Role.js
 * @import ../model/weapon/Weapon.js
 */
elf.define('FS::Controller::Director', [
    'FS::Dispatcher',
    'FS::Model::Scene',
    'FS::Model::Stage',
    'FS::Model::Role',
    'FS::Model::Weapon'
], function (dispatcher, Scene, Stage, Role, Weapon) {
    'use strict';

    var uuid = 0,
        downlink = dispatcher.downlink,
        director;

    // 为类添加工厂方法
    [Scene, Stage, Role, Weapon].forEach(function (ctor) {
        ctor.create = ctor.create || function (opts) {
            opts = opts || {};
            opts.id = String(++uuid);
            return new this(opts);
        };
    });

    // TODO 程序流程

    return director;
});