/**
 * Main Application
 *
 * @import controller/Director.js
 * @import controller/Manager.js
 * @import view/View.js
 */
elf.define('FS::App', [
    'FS::Controller::Director',
    'FS::Controller::Manager',
    'FS::View::View'
], function (director, manager, view) {
    'use strict';

    var exports = {};

    exports.init = function () {
        director.init();
        view.init();
        manager.init();
    };

    return exports;
});