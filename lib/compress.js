/*
 * @Author: salomezhang
 * @Description: a set of compression methods
 * @Date: 2019-04-09 19:02:33
 */

const { execFile, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const optipng = require('optipng-bin');
const pngcrush = require('pngcrush-bin');
const pngquant = require('pngquant-bin');
const { formatFileSize, copyFile } = require('./utils');
const COMPRESS_THRESHOLD = 0.05;
const SVGO = require('svgo');
const svgo = new SVGO();

function compressByPngquant(inputPath, outputPath, quality) {
    console.log('---compressByPngquant---');
    try {
        const stdout = execFileSync(pngquant, ['--force', '--skip-if-larger', '--verbose', '--strip', '--speed', '3', '--quality', `${quality}`, '-o', outputPath, inputPath]);
        // console.log(stdout);
    } catch (err) {
    }
}

function compressByPngcrush(inputPath) {
    console.log('---compressByPngcrush---');
    try {
        const stdout = execFileSync(pngcrush, ['-ow', '-noforce', inputPath]);
        // console.log(stdout);
    } catch (e) {

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
    let extname = path.extname(filePath);
    let ext = extname.slice(1);
    let funName = `compress${firstUpperCase(ext)}File`;
    eval(funName + `('${filePath}')`);
}

function compressPngFile(filePath, feflow) {
    const log = feflow.log;
    log.info("compress:" + filePath);
    const baseName = path.basename(filePath);
    const dir = path.dirname(filePath);
    const tempPath = path.join(dir, 'optemp_' + baseName);


    const oriSize = getFileSize(filePath);
    // oriTotalSize += oriSize;
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
    if (tempSize > 0 && (oriSize - tempSize) / oriSize < COMPRESS_THRESHOLD || tempSize < 0) {
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

    // compressTotalSize += tempSize;

    fs.unlinkSync(tempPath);
    return {
        oriSize,
        compressSize: tempSize
    }
}

async function compressSvgFile(filePath, feflow) {
    const log = feflow.log;
    log.info("compress:" + filePath);
    const baseName = path.basename(filePath);

    const oriSize = getFileSize(filePath);
    let data = fs.readFileSync(filePath, 'utf-8');
    let result = await svgo.optimize(data, { path: filePath });
    fs.writeFileSync(filePath, result.data);

    compressSize = getFileSize(filePath);
    log.info('compressBySvgo size:', compressSize);

    return {
        oriSize,
        compressSize
    }

}

module.exports = {
    compressPngFile,
    compressSvgFile
}