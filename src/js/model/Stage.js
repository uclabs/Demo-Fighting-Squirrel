/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::Model::Stage', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Stage = Class.extend({
            type: 'Stage',
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: {
            }
        });

    return Stage;
});