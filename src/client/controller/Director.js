/**
 * Director
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/async.js
 * @import ../../common/Config.js
 * @import ../../common/Util.js
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
        ctor: function(opts) {
            this._super(opts);
        },
        onModeChange: function(mode) {
            
        }
    });

    return Director;
});