/**
 * Timer
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../common/Util.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Timer', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Timer',
        Timer = Class.extend({
            type: type,
            countdown: 30,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
            },
            mix: util.mix,
            start: function (countdown) {
                this.countdown = countdown;
                log('view:' + this.type + ':' + this.uuid, 'start');
            },
            stop: function () {
                log('view:' + this.type + ':' + this.uuid, 'stop');
            },
            tick: function (countdown) {
                this.countdown = countdown;
                log('view:' + this.type + ':' + this.uuid, 'tick', this.countdown);
            }
        });

    Timer.type = type;

    return Timer;
});