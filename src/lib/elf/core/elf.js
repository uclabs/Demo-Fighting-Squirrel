/**
 * ElfJS: microkernel for modular javascript
 * base on OzJS https://github.com/dexteryy/OzJS/
 * modified by Hinc
 */
/*jshint boss: true, loopfunc: true */
(function (undefined) {

var muid = 0,
    _module = {},
    _scripts = {};

/**
 * @public define / register a module and its meta information
 * @param {string} module name. optional as unique module in a script file
 * @param {string[]} dependencies. optional
 * @param {function} module code, execute only once on the first call
 */
function define(name, depends, block) {
    var m;
    if (!block) {
        if (depends) {
            block = depends;
        } else {
            block = name;
            if (typeof name != 'string')
                name = '';
        }
        if (typeof name == 'string') {
            depends = [];
        } else {
            depends = name;
            name = '';
        }
    }

    m = _module[name] = {
        id: ++muid,
        name: name,
        deps: depends || []
    };

    if (typeof block != 'string') {
        m.block = block;
        m.loaded = 2;
    } else { // remote module
        m.url = block;
    }
}

/**
 * @public run a code block its dependencies 
 * @param {string[]} [module name] dependencies
 * @param {function}
 */ 
function require(depends, block) {
    var m, remotes = 0, i, len,
        list = scan(depends);
    for (i=0, len=list.length; i<len; i++) {
        m = list[i];
        if (m.url && m.loaded != 2) {
            remotes++;
            m.loaded = 1;
            fetch(m, function () {
                this.loaded = 2;
                if (--remotes <= 0) {
                    require.call(window, depends, block);
                }
            });
        }
    }
    if (!remotes) {
        list.push({
            deps: depends,
            block: block
        });
        return exec(list.reverse());
    }
}

/**
 * @private execute modules in a sequence of dependency
 * @param {object[]} [module object]
 */ 
function exec(list) {
    var m, depObjs, exportObj, i, len, name, result, e;
    while (m = list.pop()) {
        if (!m.block && m.exports !== undefined)
            continue;
        depObjs = [];
        exportObj = {};
        m.deps.push('require', 'exports', 'module');
        for (i=0, len=m.deps.length; i<len; i++) {
            name = m.deps[i];
            switch (name) {
                case 'require':
                    depObjs.push(requireFn);
                    break;
                case 'exports':
                    depObjs.push(exportObj);
                    break;
                case 'module':
                    depObjs.push(m);
                    break;
                default:
                    depObjs.push((_module[name] || {}).exports);
            }
        }
        // execute module code, arguments: [dep1, dep2, ..., require, exports, module]
        result = m.block.apply(elf, depObjs) || null;
        // for "module" module
        if (m.exports !== undefined)
            continue;
        m.exports = result || exportObj;
        // replace module.exports with exportObj for "exports" module
        for (e in exportObj) {
            if (e)
                m.exports = exportObj;
            break;
        }
    }
}

/**
 * @private search and sequence all dependencies, based on DFS
 * @param {string[]} a set of module names
 * @param {object[]} a sequence of modules, for recursion
 * @return {object[]} a sequence of modules
 */ 
function scan(depends, list) {
    list = list || [];
    var history = list.history;
    if (!history)
        history = list.history = {};
    var deps, name;
    if (depends[1]) {
        deps = depends;
        depends = false;
    } else {
        name = depends[0];
        depends = _module[name];
        if (depends) {
            if (history[name])
                return list;
        } else {
            return list;
        }
        if (!history[name]) {
            deps = depends.deps || [];
            history[name] = true;
        } else {
            deps = [];
        }
    }
    for (var i=deps.length-1; i>=0; i--) {
        if (!history[deps[i]])
            arguments.callee([deps[i]], list);
    }
    if (depends) {
        list.push(depends);
    }
    return list;
}

/**
 * @private for "require" module
 */ 
function requireFn(name) {
    var list = scan([name]);
    exec(list.reverse());
    return (_module[name] || {}).exports;
}

/**
 * @private observer for script loader, prevent duplicate requests
 * @param {object} module object
 * @param {function} callback
 */ 
function fetch(m, cb){
    var url = m.url,
        observers = _scripts[url];
    if (!observers) {
        observers = _scripts[url] = [cb];
        getScript(url, function () {
            observers.forEach(function (ob) {
                ob.call(this);
            }, m);
            _scripts[url] = 1;
        });
    } else if (observers === 1) {
        cb.call(m);
    } else {
        observers.push(cb);
    }
}

/**
 * @private non-blocking script loader
 * @param {string}
 * @param {object} config
 */ 
function getScript(url, op){
    var doc = window.document,
        s = doc.createElement('script'),
        h = doc.getElementsByTagName('head')[0],
        done = false;
    s.type = 'text/javascript';
    if (!op)
        op = {};
    else if (typeof op == 'function')
        op = { callback: op };
    if (op.charset)
        s.charset = op.charset;
    s.src = url;
    s.onload = s.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            s.onload = s.onreadystatechange = null;
            h.removeChild(s);
            if (op.callback)
                op.callback();
        }
    };
    h.appendChild(s);
}

window.elf = {
    define: define,
    require: require
};

window.define = define;
window.require = require;

})();