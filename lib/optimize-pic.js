
const {execFile,execFileSync} = require('child_process');
const optipng = require('optipng-bin');
const pngcrush = require('pngcrush-bin');
const pngquant = require('pngquant-bin');
const path = require('path');
const fs = require('fs');
const goodbye = require('./goodbye');
const {getFileList,formatFileSize,copyFile} = require('./utils');

const COMPRESS_THRESHOLD = 0.05;

let oriTotalSize = 0;
let compressTotalSize = 0;

function compressByPngquant(inputPath, outputPath, quality) {
    console.log('---compressByPngquant---');
    try {
        const stdout = execFileSync(pngquant, ['--force','--skip-if-larger','--verbose','--strip','--speed','3','--quality' ,`${quality}`,'-o', outputPath, inputPath]);
        // console.log(stdout);
    } catch (err) {
    }
}

function compressByPngcrush(inputPath) {
    console.log('---compressByPngcrush---');
    try {
        const stdout = execFileSync(pngcrush, ['-ow','-noforce', inputPath]);
        // console.log(stdout);
    }catch (e) {

    }


}

function compressByOptipng(inputPath) {
    console.log('---compressByOptipng---');
    try {
        const stdout = execFileSync(optipng, [inputPath]);
        // console.log(stdout);
    } catch (e) {

    }
}

function getFileSize(path) {
    try {
        const stats = fs.statSync(path);
        return stats.size;
    } catch (e) {
        return -1;
    }
}

function compressFile(filePath) {
    const log = feflow.log;
    log.info("compress:" + filePath);
    const baseName = path.basename(filePath);
    const dir = path.dirname(filePath);
    const tempPath = path.join(dir, 'optemp_'+baseName);


    const oriSize = getFileSize(filePath);
    oriTotalSize += oriSize;
    let quality;
    if (oriSize < 1000) {
        quality = 100;
    } else {
        quality = 90;
    }
    compressByPngquant(filePath, tempPath, quality);



    log.info('oriSize:', oriSize);
    let tempSize = getFileSize(tempPath);
    log.info('compressByPngquant size:', tempSize);
    if (tempSize > 0 && (oriSize-tempSize)/oriSize < COMPRESS_THRESHOLD|| tempSize < 0) {
        copyFile(filePath, tempPath);
    }

    tempSize = getFileSize(tempPath);
    log.info('compressByPngquant size copy:', tempSize);

    compressByPngcrush(tempPath);
    tempSize = getFileSize(tempPath);
    log.info('compressByPngcrush size:', tempSize);

    compressByOptipng(tempPath);
    tempSize = getFileSize(tempPath);
    log.info('compressByOptipng size:', tempSize);

    if (oriSize > tempSize) {
        copyFile(tempPath, filePath);
    }

    compressTotalSize += tempSize;

    fs.unlinkSync(tempPath);

}

function fileCanCompress(filePath) {
    const baseName = path.basename(filePath);
    if (baseName.indexOf('optemp_') ===0) {
        feflow.log.error('temp file not clear:'+filePath);
        return false;
    }
    const extname = path.extname(filePath);
    return extname === '.png';
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

function compressFolder(folderPath) {
    checkPath();

    const fileList = getFileList(folderPath);
    fileList.forEach((file) =>{
        if (fileCanCompress(file)) {
            compressFile(file);
        }
    });

    //end log
    feflow.log.info(getMultiLine(console_text));
    feflow.log.info(`optimize pic complete for ${fileList.length} files !!`);
    feflow.log.info(`origin size: ${oriTotalSize}, compressed size: ${compressTotalSize}`);
    feflow.log.info(`SAVED size: ${formatFileSize(oriTotalSize - compressTotalSize)}, ${((oriTotalSize - compressTotalSize)/oriTotalSize * 100).toFixed(2)}%`);
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