/**
 * Remote
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../common/Config.js
 * @import ../../common/Util.js
 */
elf.define('FS::Controller::Remote', [
    'lang',
    'FS::Config',
    'FS::Util'
], function (_, config, util) {
    'use strict';

    var remote = {
            mix: util.mix
        };

    return remote;
});