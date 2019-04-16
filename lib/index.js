'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 压缩图片插件
 *
 * author: zeyqiao
 * date: 2018-12-16
 */
var path = require("path");
var optimize_pic_1 = require("./optimize-pic");
var optimizePic = function () {
    optimize_pic_1.default.compressFolder(path.resolve('./src'));
    console.log('optimizePic');
};
if (typeof feflow !== 'undefined') {
    // Register command
    feflow.cmd.register('upic', 'Config ivweb dependencies', {}, optimizePic);
}
else {
    //支持非feflow环境
    module.exports = {
        compressFolder: optimize_pic_1.default.compressFolder,
        compressFile: optimize_pic_1.default.compressFile,
        optimizePic: optimizePic //压缩src目录
    };
}
