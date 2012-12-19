/**
 * Main Application
 */
elf.define('FS::App', [
    'FS::Controller::Director',
    'FS::Controller::Manager',
    'FS::View::Scene',
    'FS::View::Splash',
    'FS::View::Stage'
], function (Director, Manager) {
    var exports = {},
        director, manager;

    exports.init = function() {
        director = new Director();
        manager = new Manager();

        manager.init();
    };

    return exports;
});