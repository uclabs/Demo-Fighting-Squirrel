/**
 * Dispatcher
 *
 * @import ../lib/elf/core/event.js
 */
elf.define('FS::Dispatcher', ['event'], function (Event) {
    'use strict';
    return {
        uplink: new Event(),
        downlink: new Event()
    };
});