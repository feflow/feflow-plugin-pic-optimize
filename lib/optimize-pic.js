
const {execFile,execFileSync} = require('child_process');
const optipng = require('optipng-bin');
const pngcrush = require('pngcrush-bin');
const pngquant = require('pngquant-bin');
const path = require('path');
const fs = require('fs');
const goodbye = require('./goodbye');
const { getFileList, formatFileSize, copyFile, isEmptyObject, initFeflow, firstUpperCase} = require('./utils');
const compress = require('./compress');
const EXT_TYPE = ['.png', '.svg'];

let oriTotalSize = 0;
let compressTotalSize = 0;

function getFileSize(path) {
    try {
        const stats = fs.statSync(path);
        return stats.size;
    } catch (e) {
        return -1;
    }
}

async function compressFile(filePath) {
    let extname = path.extname(filePath);
    let ext = extname.slice(1);
    let funName = `compress${firstUpperCase(ext)}File`;
    let size = await compress[funName](filePath, feflow);
    oriTotalSize += size.oriSize;
    compressTotalSize += size.compressSize;
}

function fileCanCompress(filePath) {
    const baseName = path.basename(filePath);
    if (baseName.indexOf('optemp_') === 0) {
        feflow.log.error('temp file not clear:'+filePath);
        return false;
    }
    const extname = path.extname(filePath);
    return  EXT_TYPE.indexOf(extname) > -1 ? true : false;
}

function checkPath() {
    const pngquantSize = getFileSize(pngquant);
    const pngcrushSize = getFileSize(pngcrush);
    const optipngSize = getFileSize(optipng);
    if (pngquantSize < 0) {
        throw new Error('pngquant is not installed completely, ' + pngquant + ' is not exsited! Please check the termial proxy!');
    }

    if (pngcrushSize < 0) {
        throw new Error('pngcrush is not installed completely, ' + pngcrush + ' is not exsited! Please check the termial proxy!');
    }

     if (optipngSize < 0) {
        throw new Error('optipng is not installed completely, ' + optipng + ' is not exsited! Please check the termial proxy!');
    }
}

async function compressFolder(folderPath) {
    if (!global.feflow || isEmptyObject(global.feflow)) {
        feflow = initFeflow();
    }
    checkPath();

    const fileList = getFileList(folderPath);
    // fileList.forEach(async (file) =>{
    //     if (fileCanCompress(file)) {
    //         return compressFile(file);
    //     }
    // });
    for (let i = 0; i < fileList.length; i++) {
        let file  = fileList[i];
        if (fileCanCompress(file)) {
            await compressFile(file);
        }
    }
   
    //end log
    feflow.log.info(getMultiLine(console_text));
    feflow.log.info(`optimize pic complete for ${fileList.length} files !!`);
    feflow.log.info(`origin size: ${oriTotalSize}, compressed size: ${compressTotalSize}`);
    feflow.log.info(`--SAVED size--: ${formatFileSize(oriTotalSize - compressTotalSize)}, ${((oriTotalSize - compressTotalSize) / oriTotalSize * 100).toFixed(2)}%`);
    feflow.log.info(goodbye());
    
}


var console_text = function() {
    /*


                   _oo0oo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  0\  =  /0
                ___/`---'\___
              .' \\|     |// '.
             / \\|||  :  |||// \
            / _||||| -:- |||||- \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |_/ |
           \  .-\__  '-'  ___/-. /
         ___'. .'  /--.--\  `. .'___
      ."" '<  `.___\_<|>_/___.' >' "".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `_.   \_ __\ /__ _/   .-` /  /
 =====`-.____`.___ \_____/___.-`___.-'=====
                   `=---='


 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           佛祖保佑         永无BUG
    */
};

function getMultiLine(f) {
    var lines =f.toString();
    return lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
}

module.exports = {
    compressFolder: compressFolder
};