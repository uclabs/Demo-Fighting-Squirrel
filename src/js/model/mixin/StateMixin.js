/**
 * StateMixin
 *
 * @import ../../../lib/elf/core/event.js
 */
elf.define('FS::Model::StateMixin', ['event'], function (Event) {
    'use strict';
    var mixin = {
            state: null,
            stateEvent: new Event(),
            changeState: function (newState, args) {
                var lastState = this.stat,
                    lastStateHandler = this.stateHandler[lastState],
                    stateHandler = this.stateHandler[newState];
                    
                if (newState !== lastState) {
                    if (lastStateHandler && lastState.exit) {
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
                this.stateEvent.fire(this.state);
            },
            stateChange: function(state, callback) {
                this.stateEvent.bind(state, callback);
            }
        };

    return mixin;
});