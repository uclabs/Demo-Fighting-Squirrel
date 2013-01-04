/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../Config.js
 * @import ../Util.js
 * @import ../../common/controller/DirectorBase.js
 */
elf.define('FS::Controller::Director', [
    'lang',
    'async',
    'FS::Config',
    'FS::Util',
    'FS::Controller::DirectorBase'
], function (_, async, config, util, DirectorBase) {
    'use strict';

    var Director = DirectorBase.extend({

    });

    return Director;
});