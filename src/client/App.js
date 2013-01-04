/**
 * Main Application
 *
 * @import ../common/Config.js
 * @import ../common/Log.js
 * @import ./controller/Director.js
 * @import ./controller/Manager.js
 * @import ./view/View.js
 */
elf.define('FS::App', [
    'FS::Config',
    'FS::Log',
    'FS::Controller::Director',
    'FS::Controller::Manager',
    'FS::View::View'
], function (config, log, Director, manager, view) {
    'use strict';

    var exports = {},
        director;
        
    exports.init = function () {
        log('app', '-----init-----');
        director = new Director();
        view.init();
        manager.init();
    };

    return exports;
});