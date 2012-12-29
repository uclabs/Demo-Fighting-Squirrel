/**
 * Splash
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 */
elf.define('FS::Model::Splash', [
    'lang',
    'class',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin'
], function (_, Class, util, eventMixin, elementMixin) {
    'use strict';
    
    var type = 'Splash',
        Splash = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin);
                this.config(opts);
            },
            mix: util.mix,
            hide: function () {
                log('controller:' + this.type + ':' + this.uuid, 'hide');
                this.sendView(['hide']);
            }
        });

    Splash.type = type;

    return Splash;
});