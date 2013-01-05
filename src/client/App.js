/**
 * Main Application
 *
 * @import ../common/Config.js
 * @import ../common/Log.js
 * @import ./controller/Director.js
 * @import ./controller/Manager.js
 * @import ./controller/Remote.js
 * @import ./view/View.js
 */
elf.define('FS::App', [
    'FS::Config',
    'FS::Log',
    'FS::Controller::Director',
    'FS::Controller::Manager',
    'FS::Controller::Remote',
    'FS::View::View'
], function (config, log, Director, manager, remote, view) {
    'use strict';

    var exports = {},
        director;
        
    exports.init = function () {
        log('app', '-----init-----');
        director = new Director();
        remote.init();
        view.init();
        manager.init();
    };

    return exports;
});