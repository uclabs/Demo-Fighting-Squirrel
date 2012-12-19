/**
 * Main Application
 *
 * @import controller/Manager.js
 */
elf.define('FS::App', [
    'FS::Controller::Manager',
    'FS::View::View'
], function (manager, view) {
    var exports = {};

    exports.init = function() {
        manager.init();
        view.init();
    };

    return exports;
});