/**
 * Gruntfile for Elf
 */

var docs = require('./docs'),
    packer = require('./packer'),
    server = require('./server'),
    slice = Array.prototype.slice;

module.exports = function (grunt) {
    var log = grunt.log,
        orgiWrite = log.write;

    function uncolorWrite() {
        log.write = function (msg) {
            msg = msg || '';
            msg = msg.replace(/(\s|^)_([\s\S]+?)_(?=\s|$)/g, '$1' + '$2')
                .replace(/(\s|^)\*([\s\S]+?)\*(?=\s|$)/g, '$1' + '$2');
            return orgiWrite(log.uncolor(msg));
        };
    }

    function colorWrite() {
        log.write = orgiWrite;
    }

    // task handler function wrapper
    function task(fn) {
        var args = slice.call(arguments, 1);
        return function () {
            fn.apply(this, [grunt].concat(args));
        };
    }

    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        watch: {
            files: '../docs/src/**/*.*',
            tasks: 'docs'
        },
        docs: {
            src: '../docs/src',
            dest: '../docs',
            theme: 'bootstrap'
        },
        lint: {
            files: ['../src/js/**/*.js']
        },
        pack: {
            js: {
                type: 'js',
                src: [
                    '<banner:meta.banner>',
                    '../src/lib/**/*.js',
                    '../src/js/**/*.js'
                ],
                ignore: ['../src/js/**/*.min.js'],
                dest: '../build/public/js/fs.min.js'
            },
            css: {
                type: 'css',
                src: ['<banner:meta.banner>', '../src/ui/css/base.css'],
                dest: '../build/public/css/fs.min.css'
            }
        },
        server: {
            staticPrefix: '/public',
            staticDir: '../src',
            port: 5000,
            testPath: '/test',
            debug: true
        },
        // JSHint Options
        jshint: {
            bitwise: true,
            camelcase: true,
            curly: true,
            eqeqeq: true,
            forin: true,
            immed: true,
            indent: 4,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            quotmark: 'single',
            undef: true,
            unused: true,
            strict: true,
            trailing: true,
            eqnull: true,
            es5: true,
            browser: true,
            devel: true,
            jquery: true,
            node: true,
            predef: ['elf', 'define']
        }
    });

    // private tasks
    grunt.registerTask('uncolor', uncolorWrite);
    grunt.registerTask('color', colorWrite);
    grunt.registerTask('server', task(server.grunt));
    grunt.registerTask('testserver', task(server.grunt, false, 0));

    // public tasks
    grunt.registerTask('docs', 'Generate elf\'s documents to docs.', task(docs.grunt));
    grunt.registerMultiTask('pack', 'Concat and uglify the files.', task(packer.grunt));
    grunt.registerTask('test', 'testserver qunit:elf');
    grunt.registerTask('build', 'lint test');
    grunt.registerTask('jenkins', 'uncolor lint test');
    grunt.registerTask('default', 'server');
};
