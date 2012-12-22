/**
 * Timer
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import mixin/EventMixin.js
 * @import mixin/ElementMixin.js
 * @import mixin/StateMixin.js
 */
elf.define('FS::Model::Timer', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Timer = Class.extend({
            type: 'Timer',
            countdown: 30,
            _countdown: 0,
            timer: null,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            reset: function() {
                this._countdown = this.countdown;
            },
            start: function() {
                var that = this;
                this.reset();
                this.timer = setInterval(function() {
                    that.tick();
                }, 1000);
                this.fire(['start', this._countdown]);
            },
            stop: function() {
                clearInterval(this.timer);
                this.fire(['stop']);
            },
            tick: function() {
                this._countdown--;
                this.fire(['tick', this._countdown]);
                if (this._countdown <= 0) {
                    this.changeState('stop');
                }
            },
            stateHandler: {
                timing: function() {
                    this.start();
                },
                stop: function() {
                    this.stop();
                }
            }
        });

    return Timer;
});