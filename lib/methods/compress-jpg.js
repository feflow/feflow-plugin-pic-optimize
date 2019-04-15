"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var compress_info_1 = require("../compress-info");
var fs = require("fs");
var child_process_1 = require("child_process");
var jpegtran = require("jpegtran-bin");
var mozjpeg = require("mozjpeg");
var Jpg = /** @class */ (function () {
    function Jpg() {
    }
    Jpg.compress = function (filePath) {
        var compressInfo = new compress_info_1.default();
        var log = utils_1.default.log;
        log("compress:" + filePath);
        var tempPath = utils_1.default.getTempName(filePath);
        var oriSize = utils_1.default.getFileSize(filePath);
        compressInfo.oriSize = oriSize;
        compressInfo.filePath = filePath;
        // compressByJpegtran(filePath, tempPath);
        this.compressByMozjpeg(filePath, tempPath);
        var tempSize = utils_1.default.getFileSize(tempPath);
        if (oriSize > tempSize && (oriSize - tempSize) / oriSize > this.COMPRESS_THRESHOLD) {
            utils_1.default.copyFile(tempPath, filePath);
            compressInfo.compressedSize = tempSize;
            compressInfo.isCompressed = true;
            log("orgin:" + oriSize + ", compressed:" + tempSize);
        }
        else {
            log('skip..');
            compressInfo.isCompressed = false;
        }
        fs.unlinkSync(tempPath);
        return compressInfo;
    };
    //====jpg===//
    Jpg.compressByJpegtran = function (inputPath, outputPath) {
        console.log('---compressByJpegtran---');
        try {
            var stdout = child_process_1.execFileSync(jpegtran, ['-progressive', '-copy', 'none', '-optimize', '-outfile', outputPath, inputPath]);
            // console.log(stdout);
        }
        catch (e) {
        }
    };
    Jpg.compressByMozjpeg = function (inputPath, outputPath) {
        console.log('---compressByMozjpeg---');
        try {
            var stdout = child_process_1.execFileSync(mozjpeg, ['-progressive', '-optimize', '-quality', '90', '-outfile', outputPath, inputPath]);
            console.log(stdout);
        }
        catch (e) {
            console.error(e);
        }
    };
    Jpg.COMPRESS_THRESHOLD = 0.05;
    return Jpg;
}());
exports.default = Jpg;
