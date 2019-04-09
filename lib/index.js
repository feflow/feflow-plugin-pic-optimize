'use strict';

/**
 * 压缩图片插件
 *
 * author: zeyqiao
 * date: 2018-12-16
 */

const fs = require('fs');
const path = require('path');
const {compressFolder} = require('./optimize-pic');
const { isEmptyObject } = require('./utils');

if (typeof feflow === 'undefined') {
    var feflow =  {};
} 

const optimizePic = (args) => {
    const log = feflow.log;
    global.feflow = feflow;
    compressFolder(path.resolve('./src'));

};

if (!isEmptyObject(feflow)) {
    // Register command
    feflow.cmd.register('upic', 'Config ivweb dependencies', {}, optimizePic);
} else {
    module.exports = optimizePic;
}

