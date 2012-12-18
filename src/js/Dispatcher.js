/**
 * Dispatcher
 *
 * @import ../lib/elf/core/lang.js
 * @import ../lib/elf/core/event.js
 */
elf.define('FS::Dispatcher', ['lang', 'Event'], function (_, Event) {
    return {
        uplink: new Event(),
        downlink: new Event()
    };
});