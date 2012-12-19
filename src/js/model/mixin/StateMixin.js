/**
 * StateMixin
 */
elf.define('FS::Model::StateMixin', [], function () {
    var mixin = {
            state: null,
            changeState: function (newState, args) {
                var lastState = this.stat,
                    lastStateHandler = this.stateHandler[lastState],
                    stateHandler = this.stateHandler[newState];

                if (newState !== lastState) {
                    if (lastStateHandler) {
                        lastStateHandler.exit.call(this);
                    }
                    stateHandler.init.apply(this, args);
                    this.state = newState;
                }
                
                stateHandler.main.apply(this, args);
            }
        };

    return mixin;
});