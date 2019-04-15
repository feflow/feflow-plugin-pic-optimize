"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Path = require("path");
var compress_1 = require("./compress");
var OptimizePic = /** @class */ (function () {
    function OptimizePic() {
    }
    /**
     * 压缩一个文件
     * @param filePath
     * @return boolean 是否支持压缩
     */
    OptimizePic.compressFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var compressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, compress_1.default(filePath)];
                    case 1:
                        compressInfo = _a.sent();
                        return [2 /*return*/, !compressInfo.isNotSupport];
                }
            });
        });
    };
    /**
     * 压缩一个文件夹里的文件
     * @param folderPath
     */
    OptimizePic.compressFolder = function (folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var fileList, i, file, compressInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('compressFolder');
                        fileList = utils_1.default.getFileList(folderPath);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < fileList.length)) return [3 /*break*/, 4];
                        file = fileList[i];
                        if (!this.fileCanCompress(file)) return [3 /*break*/, 3];
                        return [4 /*yield*/, compress_1.default(file)];
                    case 2:
                        compressInfo = _a.sent();
                        if (typeof compressInfo.isCompressed === 'undefined') {
                            //compress not support.
                            return [3 /*break*/, 3];
                        }
                        if (compressInfo.isCompressed) {
                            this.compressedNum++;
                            this.oriTotalSize += compressInfo.oriSize;
                            this.compressTotalSize += compressInfo.compressedSize;
                            this.addInfo(compressInfo);
                        }
                        else {
                            this.skipFilesNum++;
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        //end log
                        utils_1.default.log('\x1b[33m');
                        utils_1.default.log(this.getMultiLine(this.console_text));
                        utils_1.default.log('\x1b[0m');
                        this.printInfo();
                        utils_1.default.log("optimize pic complete, compressed \u001B[32m" + this.compressedNum + "\u001B[0m files, skiped \u001B[32m" + this.skipFilesNum + "\u001B[0m files.");
                        utils_1.default.log("origin size: \u001B[32m" + utils_1.default.formatFileSize(this.oriTotalSize) + "\u001B[0m, compressed size: \u001B[32m" + utils_1.default.formatFileSize(this.compressTotalSize) + "\u001B[0m");
                        utils_1.default.log("SAVED size: \u001B[32m" + utils_1.default.formatFileSize(this.oriTotalSize - this.compressTotalSize) + "\u001B[0m, \u001B[32m" + ((this.oriTotalSize - this.compressTotalSize) / this.oriTotalSize * 100).toFixed(2) + "%\u001B[0m");
                        utils_1.default.log(this.goodBye());
                        return [2 /*return*/];
                }
            });
        });
    };
    OptimizePic.fileCanCompress = function (filePath) {
        var baseName = Path.basename(filePath);
        if (baseName.indexOf('optemp_') === 0) {
            utils_1.default.error('temp file not clear:' + filePath);
            return false;
        }
        return true;
    };
    OptimizePic.console_text = function () {
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
    ;
    OptimizePic.getMultiLine = function (f) {
        var lines = f.toString();
        return lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
    };
    OptimizePic.addInfo = function (compressInfo) {
        this.infoList.push(compressInfo);
        console.log("addinfo:", compressInfo);
    };
    OptimizePic.printInfo = function () {
        utils_1.default.log("Compressed Files:");
        this.infoList.forEach(function (info) {
            utils_1.default.log(info.filePath + ", ||  \u001B[36m" + utils_1.default.formatFileSize(info.oriSize) + " --> " + utils_1.default.formatFileSize(info.compressedSize) + " \u001B[0m");
        });
    };
    OptimizePic.goodBye = function () {
        var byeWords = [
            'Good bye',
            'See you again',
            'Farewell',
            'Have a nice day',
            'Bye!',
            'Catch you later'
        ];
        return byeWords[(Math.random() * byeWords.length) | 0];
    };
    //打印信息
    OptimizePic.infoList = [];
    OptimizePic.compressedNum = 0;
    OptimizePic.skipFilesNum = 0;
    OptimizePic.oriTotalSize = 0;
    OptimizePic.compressTotalSize = 0;
    return OptimizePic;
}());
exports.default = OptimizePic;
