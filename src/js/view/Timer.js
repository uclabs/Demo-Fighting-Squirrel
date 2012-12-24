/**
 * Timer
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import mixin/EventMixin.js
 * @import mixin/ElementMixin.js
 * @import mixin/StateMixin.js
 */
elf.define('FS::View::Timer', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Timer = Class.extend({
            type: 'Timer',
            countdown: 30,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);console.log('view-timer', opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            start: function(countdown) {
                this.countdown = countdown;
                log('view:' + this.type + ':' + this.uuid, 'start');
            },
            stop: function() {
                log('view:' + this.type + ':' + this.uuid, 'stop');
            },
            tick: function(countdown) {
                this.countdown = countdown;
                log('view:' + this.type + ':' + this.uuid, 'tick', this.countdown);
            }
        });

    Timer.type = 'Timer';

    return Timer;
});