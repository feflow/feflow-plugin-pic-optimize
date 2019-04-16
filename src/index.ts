'use strict';

/**
 * 压缩图片插件
 *
 * author: zeyqiao
 * date: 2018-12-16
 */

import * as path from 'path';
import OptPic from './optimize-pic';

declare var feflow: any;

const optimizePic = () => {
    OptPic.compressFolder(path.resolve('./src'));
    console.log('optimizePic');
};

if (typeof feflow !== 'undefined') {
    // Register command
    feflow.cmd.register('upic', 'Config ivweb dependencies', {}, optimizePic);
} else {
    //支持非feflow环境
    module.exports = {
        compressFolder: OptPic.compressFolder,//压缩文件夹
        compressFile: OptPic.compressFile,//压缩文件
        optimizePic: optimizePic //压缩src目录
    }
}
