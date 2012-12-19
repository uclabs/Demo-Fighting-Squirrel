/**
 * ActionMixin
 */
elf.define('FS::View::ActionMixin', [], function () {
    var mixin = {
            action: null,
            changeAction: function (newAction, args) {
                var lastAction = this.action,
                    lastActionHandler = this.actionHandler[lastAction],
                    actionHandler = this.actionHandler[newAction];

                if (newAction !== lastAction) {
                    if (lastActionHandler) {
                        lastActionHandler.exit.call(this);
                    }
                    actionHandler.init.apply(this, args);
                    this.action = newAction;
                }
                
                actionHandler.main.apply(this, args);
            }
        };

    return mixin;
});