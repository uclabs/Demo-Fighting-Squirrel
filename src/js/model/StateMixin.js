/**
 * Model State
 */
elf.define('FS::Model::StateMixin', function () {
    var stateMixin = {
        state: null,
        changeState: function (newState, args) {
            var lastState = this.stateHandler[this.state],
                state = this.stateHandler[newState];

            if (newState !== this.state) {
                if (lastState) {
                    lastState.exit.call(this);
                }
                state.init.call(this);
                this.state = newState;
            }
            
            // TODO 发送事件给 View fire([this.id, 'state', newState].join(':'), args)
            state.main.apply(this, args);
        }
    };

    return stateMixin;
});