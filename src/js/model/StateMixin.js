/**
 * StateMixin
 *
 * @import ../Dispatcher.js
 */
elf.define('FS::Model::StateMixin', ['FS::Dispatcher'], function (dispatcher) {
    var downlink = dispatcher.downlink;
        mixin = {
            state: null,
            changeState: function (newState, args) {
                var lastState = this.stateHandler[this.state],
                    state = this.stateHandler[newState];

                if (newState !== this.state) {
                    if (lastState) {
                        lastState.exit.call(this);
                    }
                    state.init.apply(this, args);
                    this.state = newState;
                }
                
                this.fire(args);
                state.main.apply(this, args);
            }
        };

    return mixin;
});