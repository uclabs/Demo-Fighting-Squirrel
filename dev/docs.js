#!/usr/bin/env node
/**
 * Document generator for Elf
 */
'use strict';

var Metadoc = require('./lib/metadoc');

exports.grunt = function (grunt) {
    var config = grunt.config('docs');

    new Metadoc({
        src: config.src || '../src/docs',
        dest: config.dest || '../docs',
        theme: config.theme || 'bootstrap'
    }).gen();
};