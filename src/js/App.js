/**
 * Main Application
 *
 * @import Config.js
 * @import Log.js
 * @import controller/Director.js
 * @import controller/Manager.js
 * @import view/View.js
 */
elf.define('FS::App', [
    'FS::Config',
    'FS::Log',
    'FS::Controller::Director',
    'FS::Controller::Director',
    'FS::Controller::Manager',
    'FS::View::View'
], function (config, log, director, manager, view) {
    'use strict';

    var exports = {};

    exports.init = function () {
        log('app', '-----init-----');
        director.init();
        view.init();
        manager.init();
    };

    return exports;
});