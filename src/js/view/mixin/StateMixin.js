/**
 * StateMixin
 */
elf.define('FS::View::StateMixin', [], function () {
    var mixin = {
            state: null,
            changeState: function (newState, args) {
                var lastState = this.stat,
                    lastStateHandler = this.stateHandler[lastState],
                    stateHandler = this.stateHandler[newState];

                if (newState !== lastState) {
                    if (lastStateHandler && lastState.exit) {
                        lastStateHandler.exit.call(this);
                    }
                    if (stateHandler && stateHandler.init) {
                        stateHandler.init.apply(this, args);
                    }
                    this.state = newState;
                }
                
                if (stateHandler.main) {
                    stateHandler.main.apply(this, args);
                } else if (stateHandler) {
                    stateHandler.apply(this, args);
                }
            }
        };

    return mixin;
});