/**
 * Timer
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
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
            countdown: 10,
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
                log('controller:' + this.type + ':' + this.uuid, 'start');
                var that = this;
                this.reset();
                this.timer = setInterval(function() {
                    that.tick();
                }, 1000);

                this.sendView(['start', this._countdown]);
            },
            stop: function() {
                log('controller:' + this.type + ':' + this.uuid, 'stop');
                clearInterval(this.timer);

                this.sendView(['stop']);
            },
            tick: function() {
                // 递减倒计时时间
                this._countdown--;
                log('controller:' + this.type + ':' + this.uuid, 'tick', this._countdown);

                // 发送倒计时时间
                this.sendView(['tick', this._countdown]);

                // 判断是否倒计时结束
                if (this._countdown <= 0) {
                    this.changeState('stop');
                }
            },
            stateHandler: {
                timing: function() {
                    this.start();
                },
                pause: function() {
                    
                },
                stop: function() {
                    this.stop();
                }
            }
        });

    return Timer;
});