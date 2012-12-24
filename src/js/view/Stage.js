/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import mixin/EventMixin.js
 * @import mixin/ElementMixin.js
 * @import mixin/StateMixin.js
 */
elf.define('FS::View::Stage', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Stage = Class.extend({
            type: 'Stage',
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenServer(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: {
            }
        });

    Stage.type = 'Stage';

    return Stage;
});