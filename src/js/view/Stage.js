/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 */
elf.define('FS::Model::Stage', ['lang', 'class'], function (_, Class) {
    'use strict';

    var Stage = Class.extend({
        ctor: function () {
        },
        mix: function () {
            _.extend.apply(_, [this].concat(arguments));
        },
        stateHandler: {
        }
    });

    return Stage;
});