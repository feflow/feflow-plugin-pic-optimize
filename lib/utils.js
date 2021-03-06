"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Path = require("path");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * 文件遍历方法
     * @param filePath 需要遍历的文件路径
     * @param pathCallBack 文件一个个回调，异步的
     */
    Utils.folderWalk = function (filePath, pathCallBack) {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err);
            }
            else {
                //遍历读取到的文件列表
                files.forEach(function (filename, index, array) {
                    //获取当前文件的绝对路径
                    var filedir = Path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, function (eror, stats) {
                        if (eror) {
                            console.warn('获取文件stats失败');
                        }
                        else {
                            var isFile = stats.isFile(); //是文件
                            var isDir = stats.isDirectory(); //是文件夹
                            if (isFile) {
                                pathCallBack(filedir);
                            }
                            if (isDir) {
                                Utils.folderWalk(filedir, pathCallBack); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    });
                });
            }
        });
    };
    Utils.mkdirRecursively = function (path) {
        this.mkdir(path, "");
    };
    //第二个参数是用来递归用的，使用时忽略
    Utils.mkdir = function (dirpath, dirname) {
        //判断是否是第一次调用
        if (!dirname) {
            if (fs.existsSync(dirpath)) {
                return;
            }
            else {
                Utils.mkdir(dirpath, Path.dirname(dirpath));
            }
        }
        else {
            //判断第二个参数是否正常，避免调用时传入错误参数
            if (dirname !== Path.dirname(dirpath)) {
                Utils.mkdir(dirpath, "");
                return;
            }
            if (fs.existsSync(dirname)) {
                fs.mkdirSync(dirpath);
            }
            else {
                Utils.mkdir(dirname, Path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
    };
    /**
     * 同步获取所有文件列表
     * @param path
     * @returns {Array}
     */
    Utils.getFileList = function (path) {
        var filesList = [];
        this.readFile(path, filesList);
        return filesList;
    };
    //遍历读取文件
    Utils.readFile = function (path, filesList) {
        var files = fs.readdirSync(path); //需要用到同步读取
        files.forEach(walk);
        function walk(file) {
            var filePath = Path.join(path, file);
            var states = fs.statSync(filePath);
            if (states.isDirectory()) {
                Utils.readFile(filePath, filesList);
            }
            else {
                filesList.push(filePath);
            }
        }
    };
    /**
     * 同步复制文件
     * @param src
     * @param dist
     */
    Utils.copyFile = function (src, dist) {
        fs.writeFileSync(dist, fs.readFileSync(src));
    };
    /**
     * 格式化文件大小
     * @param fileSize
     * @param idx
     * @returns {*}
     */
    Utils.formatFileSize = function (fileSize, idx) {
        if (idx === void 0) { idx = 0; }
        var units = ["B", "KB", "MB", "GB"];
        if (fileSize < 1024 || idx === units.length - 1) {
            return fileSize.toFixed(1) + units[idx];
        }
        return Utils.formatFileSize(fileSize / 1024, ++idx);
    };
    /**
     * 同步获取文件大小
     * @param path
     */
    Utils.getFileSize = function (path) {
        try {
            var stats = fs.statSync(path);
            return stats.size;
        }
        catch (e) {
            return -1;
        }
    };
    Utils.getTempName = function (filepath) {
        var baseName = Path.basename(filepath);
        var dir = Path.dirname(filepath);
        return Path.join(dir, 'optemp_' + baseName);
    };
    /**
     * @description determine wehther the object is empty
     * @returns {Boolean}
     * */
    Utils.isEmptyObject = function (object) {
        return !Object.getOwnPropertySymbols(object).length && !Object.getOwnPropertyNames(object).length;
    };
    Utils.log = function () {
        var _a;
        var string = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            string[_i] = arguments[_i];
        }
        if (typeof feflow !== 'undefined') {
            (_a = feflow.log).info.apply(_a, string);
        }
        else {
            console.log.apply(console, string);
        }
    };
    Utils.error = function () {
        var _a;
        var string = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            string[_i] = arguments[_i];
        }
        if (typeof feflow !== 'undefined') {
            (_a = feflow.log).error.apply(_a, string);
        }
        else {
            console.error.apply(console, string);
        }
    };
    return Utils;
}());
exports.default = Utils;
