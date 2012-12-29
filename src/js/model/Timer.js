/**
 * Timer
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../Util.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::Model::Timer', [
    'lang',
    'class',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var concat = Array.prototype.concat,
        type = 'Timer',
        Timer = Class.extend({
            type: type,
            countdown: 10,
            remain: 0,
            timer: null,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: util.mix,
            tick: function () {
                // 递减倒计时时间
                this.remain -= 1;
                log('controller:' + this.type + ':' + this.uuid, 'tick', this.remain);

                // 发送倒计时时间
                this.sendView(['tick', this.remain]);
            },
            stateHandler: {
                timing: {
                    init: function() {
                    },
                    main: function () {
                        log('controller:' + this.type + ':' + this.uuid, 'start');
                        var that = this;

                        clearInterval(this.timer);
                        this.remain = this.countdown;

                        this.timer = setInterval(function () {
                            that.tick();

                            // 判断是否倒计时结束
                            if (that.remain <= 0) {
                                that.changeState('stop');
                            }
                        }, 1000);

                        this.sendView(['start', this.remain]);
                    },
                    exit: function() {
                        clearInterval(this.timer);
                    }
                },
                stop: {
                    init: function() {

                    },
                    main: function () {
                        log('controller:' + this.type + ':' + this.uuid, 'stop');
                        this.sendView(['stop']);
                    },
                    exit: function() {

                    }
                },
                pause: function () {
                    
                }
            }
        });

    Timer.type = type;

    return Timer;
});