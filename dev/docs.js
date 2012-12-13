#!/usr/bin/env node
/**
 * Document generator for Elf
 */
'use strict';

var Metadoc = require('./lib/metadoc');

exports.grunt = function (grunt) {
    var config = grunt.config('docs');

    new Metadoc({
        fromPath: config.inputPath || '../src/docs',
        toPath: config.outputPath || '../docs',
        metaFile: config.metaFile || 'meta.json',
        theme: config.theme || 'bootstrap'
    }).process();
};