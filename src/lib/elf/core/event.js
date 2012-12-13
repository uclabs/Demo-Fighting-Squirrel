/**
 * Event Module
 * original author: Dexter.Yy https://github.com/dexteryy/OzJS/blob/master/mod/event.js
 * modified by Hinc
 *
 * @import elf.js
 * @import lang.js
 */
define('event', ['lang'], function (_) {
    var slice = Array.prototype.slice;

    function getCallMethod(type){
        return function () {
            var re, fn, i, l;
            for (i = 0, l = this.length; i < l; i++) {
                fn = this[i];
                if (fn) {
                    re = fn[type].apply(fn, arguments);
                } else {
                    break;
                }
            }
            return re;
        };
    }

    function fnQueue() {
        var dup = false;
        return _.extend([], {
            call: getCallMethod('call'),
            apply: getCallMethod('apply'),
            clear: function (func) {
                if (!func) {
                    this.length = 0;
                } else {
                    var size = this.length,
                        popsize = size - dup.length;
                    for (var i = this.length - 1; i >= 0; i--) {
                        if (this[i] === func) {
                            this.splice(i, 1);
                            if (dup && i >= popsize)
                                dup.splice(size - i - 1, 1);
                        }
                    }
                    if (i < 0)
                        return false;
                }
                return true;
            }
        });
    }

    function Promise(opt){
        if (opt) {
            this.subject = opt.subject;
            this.trace = opt.trace;
            this.traceStack = opt.traceStack || [];
        }
        this.doneHandlers = fnQueue();
        this.failHandlers = fnQueue();
        this.observeHandlers = fnQueue();
        this._alterQueue = fnQueue();
        this._lastDoneQueue = [];
        this._lastFailQueue = [];
        this.status = 0;
        this._argsCache = [];
    }

    var actors = Promise.prototype = {
        then: function(handler, errorHandler){
            var _status = this.status;
            if (errorHandler) {
                if (_status === 2) {
                    this._resultCache = errorHandler.apply(this, this._argsCache);
                } else if (!_status) {
                    this.failHandlers.push(errorHandler);
                    this._lastFailQueue = this.failHandlers;
                }
            } else {
                this._lastFailQueue = [];
            }
            if (handler) {
                if (_status === 1) {
                    this._resultCache = handler.apply(this, this._argsCache);
                } else if (!_status) {
                    this.doneHandlers.push(handler);
                    this._lastDoneQueue = this.doneHandlers;
                }
            } else {
                this._lastDoneQueue = [];
            }
            return this;
        },

        done: function(handler){
            return this.then(handler);
        },

        fail: function(handler){
            return this.then(false, handler);
        },

        always: function (handler) {
            return this.then(handler, handler);
        },

        cancel: function(handler, errorHandler){
            if (handler) {
                this.doneHandlers.clear(handler);
            }
            if (errorHandler) {
                this.failHandlers.clear(errorHandler);
            }
            return this;            
        },

        bind: function(handler){
            if (this.status) {
                handler.apply(this, this._argsCache);
            }
            this.observeHandlers.push(handler);
            return this;
        },

        unbind: function(handler){
            this.observeHandlers.clear(handler);
            return this;            
        },

        fire: function(params){
            if (this.trace) {
                this._trace();
            }
            params = params || [];
            this.observeHandlers.apply(this, params);
            var onceHandlers = this.doneHandlers;
            this.doneHandlers = this._alterQueue;
            onceHandlers.apply(this, params);
            onceHandlers.length = 0;
            this._alterQueue = onceHandlers;
            return this;
        },

        error: function(params){
            if (this.trace) {
                this._trace();
            }
            params = params || [];
            this.observeHandlers.apply(this, params);
            var onceHandlers = this.failHandlers;
            this.failHandlers = this._alterQueue;
            onceHandlers.apply(this, params); 
            onceHandlers.length = 0;
            this._alterQueue = onceHandlers;
            return this;
        },

        resolve: function(params){
            this.status = 1;
            this._argsCache = params;
            return this.fire(params);
        },

        reject: function(params){
            this.status = 2;
            this._argsCache = params;
            return this.error(params);
        },

        reset: function(){
            this.status = 0;
            this._argsCache = [];
            this.doneHandlers.length = 0;
            this.failHandlers.length = 0;
            return this;
        },

        _trace: function(){
            this.traceStack.unshift(this.subject);
            if (this.traceStack.length > this.trace) {
                this.traceStack.pop();
            }
        },

        follow: function(){
            var next = new Promise();
            next._prevActor = this;
            if (this.status) {
                pipe(this._resultCache, next);
            } else {
                var doneHandler = this._lastDoneQueue.pop();
                if (doneHandler) {
                    this._lastDoneQueue.push(function(){
                        return pipe(doneHandler.apply(this, arguments), next);
                    });
                }
                var failHandler = this._lastFailQueue.pop();
                if (failHandler) {
                    this._lastFailQueue.push(function(){
                        return pipe(failHandler.apply(this, arguments), next);
                    });
                }
            }
            return next;
        },

        end: function(){
            return this._prevActor;
        },

        all: function(){
            this._count = this._total;
            return this;
        },

        any: function(){
            this._count = 1;
            return this;
        },

        some: function(n){
            this._count = n;
            return this;
        }

    };

    function when(){
        var mutiArgs = [],
            mutiPromise = new Promise();
        mutiPromise._count = mutiPromise._total = arguments.length;
        _.each.call(arguments, function(promise, i){
            var mutiPromise = this;
            promise.then(callback, callback);
            function callback(params){
                mutiArgs[i] = params;
                if (--mutiPromise._count === 0) {
                    mutiPromise.resolve.call(mutiPromise, mutiArgs);
                }
            }
        }, mutiPromise);
        return mutiPromise;
    }

    function pipe(prev, next){
        if (prev && prev.then) {
            prev.then(function(){
                next.resolve(slice.call(arguments));
            }, function(){
                next.reject(slice.call(arguments));
            });
        }
        return prev;
    }

    function dispatchFactory(i){
        return function(subject){
            var promise = this.lib[subject];
            if (!promise) {
                promise = this.lib[subject] = new Promise({ 
                    subject: subject, 
                    trace: this.trace,
                    traceStack: this.traceStack
                });
            }
            promise[i].apply(promise, slice.call(arguments, 1));
            return this;
        };
    }

    function Event(opt){
        if (opt) {
            this.trace = opt.trace;
            this.traceStack = opt.traceStack;
        }
        this.lib = {};
    }

    Event.prototype = (function(methods){
        for (var i in actors) {
            methods[i] = dispatchFactory(i);
        }
        return methods;
    })({});

    Event.prototype.promise = function(subject){
        var promise = this.lib[subject];
        if (!promise) {
            promise = this.lib[subject] = new Promise({ 
                subject: subject, 
                trace: this.trace,
                traceStack: this.traceStack
            });
        }
        return promise;
    };

    Event.prototype.when = function(){
        var args = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(this.promise(arguments[i]));
        }
        return when.apply(this, args);
    };

    Event.Promise = Promise;
    Event.when = when;

    return Event;
});