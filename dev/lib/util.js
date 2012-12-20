/**
 * Utility Module
 *
 * A set of useful functions
 */
'use strict';

var fs = require('fs'),
    path = require('path'),
    globSync = require('glob-whatev'),
    existsSync = fs.existsSync || path.existsSync,
    slice = Array.prototype.slice,
    isArray = Array.isArray;

// expand minimatch path to files' realpath
function expandPath() {
    var args = slice.call(arguments),
        arg, input, filter,
        output = [];
    while (arg = args.shift()) {
        switch (typeof arg) {
        case 'object':
            if (isArray(arg)) {
                input = arg;
            } else {
                input = isArray(arg.src) ? arg.src :
                    typeof arg.src === 'string' ? [arg.src] :
                    [];
                filter = arg.filter || null;
            }
            break;
        case 'string':
            input = [arg];
            break;
        case 'function':
            filter = arg;
            break;
        }
    }
    input = isArray(input) ? input : [];

    input.forEach(function (pattern) {
        globSync.glob(pattern).map(function (file) {
            var realpath = fs.realpathSync(file);
            if (output.indexOf(realpath) === -1) {
                output.push(realpath);
            }
        });
    });

    if (filter) {
        output = output.filter(filter);
    }
    return output;
}

// return an array of a file's depends
function getDepends(file) {
    var data = fs.readFileSync(file, 'utf8').split('\n'),
        i, l, line, match,
        importPattern = /@import\s+(\S+)/,
        endPattern = /\*\//,
        deps = [], dep;

    for (i=0, l=data.length; i<l; i++) {
        line = data[i];
        match = importPattern.exec(line);
        if ((match || []).length > 1) {
            dep = match[1];
            if (/^\w/.test(dep)) {
                dep = './' + dep;
            }
            deps.push(path.resolve(path.dirname(file), dep));
        }
        if (endPattern.test(line)) {
            break;
        }
    }
    return deps;
}

// return an array of input's depends in depth-first order
function calcDepends(input, files, cache) {
    var i, l = input.length,
        file, deps;
    files = files || [];
    cache = cache || {};
    
    for (i=0; i<l; i++) {
        file = input[i];
        if (files.indexOf(file) === -1) {
            deps = cache[file];
            if (!deps) {
                deps = cache[file] = getDepends(file);
            }
            if (deps && deps.length > 0) {
                calcDepends(deps, files, cache);
            }
            files.push(file);
        }
    }

    return files;
}

function copyFile(src, destPath, overwrite) {
    var dest = destPath;
    if (!existsSync(dest)) {
        destPath = path.dirname(destPath);
        if (!existsSync(destPath)) {
            throw Error(destPath + ' not found.');
        } else if (!fs.statSync(destPath).isDirectory()) {
            throw Error(destPath + ' is not directory.');
        }
    } else if (fs.statSync(dest).isDirectory()) {
        dest = path.join(destPath, path.basename(src));
    }

    if (existsSync(dest) && !overwrite) {
        console.log('File "' + dest + '" exists. Skip.');
        return;
    }

    fs.writeFileSync(dest, fs.readFileSync(src));
}

function copyDir(src, destPath, overwrite) {
    var dest = destPath,
        stat = fs.statSync(src),
        files;
    if (!stat.isDirectory()) {
        return copyFile(src, dest, overwrite);
    }

    if (!existsSync(dest)) {
        destPath = path.dirname(destPath);
        if (!existsSync(destPath)) {
            throw Error(destPath + ' not found.');
        } else if (!fs.statSync(destPath).isDirectory()) {
            throw Error(destPath + ' is not directory.');
        }
    } else if (fs.statSync(dest).isDirectory() && !overwrite) {
        // 这里有一个 Bug，Windows 下 src 只能是相对路径
        dest = path.join(destPath, src);
    }

    if (!existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    fs.readdirSync(src).forEach(function (file) {
        copyDir(path.join(src, file), path.join(dest, file),
            overwrite);
    });
}

function mkdirp(dirPath, mode) {
    var dir = path.resolve(dirPath),
        parrent = path.dirname(dir);
    if (!existsSync(dir)) {
        if (!existsSync(parrent)) {
            mkdirp(parrent);
        }
        fs.mkdirSync(dir, mode);
    }
}

exports.minimatch = globSync.minimatch;
exports.globSync = globSync.glob;
exports.expandPath = expandPath;
exports.getDepends = getDepends;
exports.calcDepends = calcDepends;
exports.copyFile = copyFile;
exports.mkdirp = mkdirp;
exports.copyDir = copyDir;