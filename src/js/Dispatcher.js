/**
 * Dispatcher
 *
 * @import ../lib/elf/core/event.js
 */
elf.define('FS::Dispatcher', ['Event'], function (Event) {
    'use strict';
    return {
        uplink: new Event(),
        downlink: new Event()
    };
});