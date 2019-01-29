'use strict';

/**
 * 压缩图片插件
 *
 * author: zeyqiao
 * date: 2018-12-16
 */

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const {compressFolder} = require('./optimize-pic');



const optimizePic = (args) => {
    const log = feflow.log;
    global.feflow = feflow;
    compressFolder(path.resolve('./src'));

};

// Register command
feflow.cmd.register('upic', 'Config ivweb dependencies', {}, optimizePic);
