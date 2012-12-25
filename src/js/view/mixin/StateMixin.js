/**
 * StateMixin
 *
 * @import ../../../lib/elf/core/event.js
 */
elf.define('FS::View::StateMixin', ['event'], function (Event) {
    'use strict';
    var mixin = {
            state: null,
            stateEvent: new Event(),
            // 改变状态
            changeState: function (newState, args) {
                var lastState = this.stat,
                    lastStateHandler = this.stateHandler[lastState],
                    stateHandler = this.stateHandler[newState];

                if (newState !== lastState) {
                    if (lastStateHandler && lastStateHandler.exit) {
                        lastStateHandler.exit.call(this);
                    }
                    this.state = newState;
                    if (stateHandler && stateHandler.init) {
                        stateHandler.init.apply(this, args);
                    }
                }
                
                if (stateHandler && stateHandler.main) {
                    stateHandler.main.apply(this, args);
                } else if (stateHandler) {
                    stateHandler.apply(this, args);
                }
                
                // 派发状态改变事件
                if (this.stateEvent) {
                    this.stateEvent.fire(this.state);
                }
            },
            onStateChange: function(state, callback) {
                if (!this.stateEvent) {
                    this.stateEvent = new Event();
                }
                this.stateEvent.bind(state, callback);
            }
        };

    return mixin;
});