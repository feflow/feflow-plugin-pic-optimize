"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compress_info_1 = require("../compress-info");
var fs = require("fs");
var child_process_1 = require("child_process");
var optipng = require("optipng-bin");
var pngcrush = require("pngcrush-bin");
var pngquant = require("pngquant-bin");
var Png = /** @class */ (function () {
    function Png() {
    }
    Png.compress = function (filePath) {
        var compressInfo = new compress_info_1.default();
        var log = utils_1.default.log;
        log("compress:" + filePath);
        var tempPath = utils_1.default.getTempName(filePath);
        var oriSize = utils_1.default.getFileSize(filePath);
        compressInfo.oriSize = oriSize;
        var quality;
        if (oriSize < 1000) {
            quality = 100;
        }
        else {
            quality = 90;
        }
        this.compressByPngquant(filePath, tempPath, quality);
        log('oriSize:', oriSize);
        var tempSize = utils_1.default.getFileSize(tempPath);
        log('compressByPngquant size:', tempSize);
        if (tempSize > 0 && (oriSize - tempSize) / oriSize < this.COMPRESS_THRESHOLD || tempSize < 0) {
            utils_1.default.copyFile(filePath, tempPath);
        }
        tempSize = utils_1.default.getFileSize(tempPath);
        log('compressByPngquant size copy:', tempSize);
        this.compressByPngcrush(tempPath);
        tempSize = utils_1.default.getFileSize(tempPath);
        log('compressByPngcrush size:', tempSize);
        this.compressByOptipng(tempPath);
        tempSize = utils_1.default.getFileSize(tempPath);
        log('compressByOptipng size:', tempSize);
        if (oriSize > tempSize) {
            utils_1.default.copyFile(tempPath, filePath);
            compressInfo.compressedSize = tempSize;
            compressInfo.isCompressed = true;
            compressInfo.filePath = filePath;
            log("orgin:" + oriSize + ", compressed:" + tempSize);
        }
        else {
            log('skip..');
            compressInfo.isCompressed = false;
        }
        fs.unlinkSync(tempPath);
        return compressInfo;
    };
    Png.compressByPngquant = function (inputPath, outputPath, quality) {
        console.log('---compressByPngquant---');
        try {
            var stdout = child_process_1.execFileSync(pngquant, ['--force', '--skip-if-larger', '--verbose', '--strip', '--speed', '3', '--quality', "" + quality, '-o', outputPath, inputPath]);
            // console.log(stdout);
        }
        catch (err) {
        }
    };
    Png.compressByPngcrush = function (inputPath) {
        console.log('---compressByPngcrush---');
        try {
            var stdout = child_process_1.execFileSync(pngcrush, ['-ow', '-noforce', inputPath]);
            // console.log(stdout);
        }
        catch (e) {
        }
    };
    Png.compressByOptipng = function (inputPath) {
        console.log('---compressByOptipng---');
        try {
            var stdout = child_process_1.execFileSync(optipng, [inputPath]);
            // console.log(stdout);
        }
        catch (e) {
        }
    };
    Png.COMPRESS_THRESHOLD = 0.05;
    return Png;
}());
exports.default = Png;
