/**
 * StateMixin
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/core/event.js
 */
elf.define('FS::Model::StateMixin', [
    'lang',
    'event'
], function (_, Event) {
    'use strict';
    
    var mixin = {
            state: null,
            stateEvent: null,
            // 改变状态
            changeState: function (newState, args) {
                var lastState = this.state,
                    stateChange = newState !== lastState,
                    lastStateHandler = this.stateHandler[lastState],
                    stateHandler = this.stateHandler[newState];
                    
                if (stateChange) {
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
                if (this.stateEvent && stateChange) {
                    this.stateEvent.fire('_all_', [this.state]);
                    this.stateEvent.fire(this.state, [this.state]);
                }
            },
            onStateChange: function (state, callback) {
                if (!this.stateEvent) {
                    this.stateEvent = new Event();
                }
                if (_.type(state) === 'function') {
                    callback = state;
                    state = '_all_';
                }
                this.stateEvent.bind(state, callback);
            }
        };

    return mixin;
});