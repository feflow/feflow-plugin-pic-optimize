"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compress_info_1 = require("../compress-info");
var fs = require("fs");
var child_process_1 = require("child_process");
var gifsicle = require("gifsicle");
/**
 *
 * method for compress Gif
 * author: zeyqiao
 * date: 2019-04-14
 */
var Gif = /** @class */ (function () {
    function Gif() {
    }
    Gif.compress = function (filePath) {
        var compressInfo = new compress_info_1.default();
        var log = utils_1.default.log;
        log("compress:" + filePath);
        var tempPath = utils_1.default.getTempName(filePath);
        var oriSize = utils_1.default.getFileSize(filePath);
        compressInfo.oriSize = oriSize;
        this.compressByGifsicle(filePath, tempPath);
        var tempSize = utils_1.default.getFileSize(tempPath);
        if (oriSize > tempSize && (oriSize - tempSize) / oriSize > this.COMPRESS_THRESHOLD) {
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
    Gif.compressByGifsicle = function (inputPath, outputPath) {
        console.log('---compressByGifsicle---');
        console.log(inputPath, outputPath);
        try {
            var stdout = child_process_1.execFileSync(gifsicle, ['-O3', '-o', outputPath, inputPath]);
            console.log(stdout);
        }
        catch (e) {
            console.log(e);
        }
    };
    Gif.COMPRESS_THRESHOLD = 0.05;
    return Gif;
}());
exports.default = Gif;
