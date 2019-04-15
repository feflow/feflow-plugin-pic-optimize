import * as fs from 'fs';
import * as Path from 'path';

/**
 * 工具类
 *
 * author: zeyqiao
 * date: 2019-04-14
 */
declare var feflow: any;

export default class Utils {
    /**
     * 文件遍历方法
     * @param filePath 需要遍历的文件路径
     * @param pathCallBack 文件一个个回调，异步的
     */
    public static folderWalk(filePath: string, pathCallBack: Function): void {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err)
            } else {
                //遍历读取到的文件列表
                files.forEach(function (filename, index, array) {
                    //获取当前文件的绝对路径
                    let filedir = Path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, function (eror, stats) {
                        if (eror) {
                            console.warn('获取文件stats失败');
                        } else {
                            let isFile = stats.isFile();//是文件
                            let isDir = stats.isDirectory();//是文件夹
                            if (isFile) {
                                pathCallBack(filedir);
                            }
                            if (isDir) {
                                Utils.folderWalk(filedir, pathCallBack);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                });
            }
        });
    }


    public static mkdirRecursively(path: string): void {
        this.mkdir(path, "");
    }

    //第二个参数是用来递归用的，使用时忽略
    private static mkdir(dirpath: string, dirname: string): void {
        //判断是否是第一次调用
        if (!dirname) {
            if (fs.existsSync(dirpath)) {
                return;
            } else {
                Utils.mkdir(dirpath, Path.dirname(dirpath));
            }
        } else {
            //判断第二个参数是否正常，避免调用时传入错误参数
            if (dirname !== Path.dirname(dirpath)) {
                Utils.mkdir(dirpath, "");
                return;
            }
            if (fs.existsSync(dirname)) {
                fs.mkdirSync(dirpath)
            } else {
                Utils.mkdir(dirname, Path.dirname(dirname));
                fs.mkdirSync(dirpath);
            }
        }
    }


    /**
     * 同步获取所有文件列表
     * @param path
     * @returns {Array}
     */
    public static getFileList(path: string): string[] {
        const filesList = [];
        this.readFile(path, filesList);
        return filesList;
    }

    //遍历读取文件
    private static readFile(path, filesList): void {
        const files = fs.readdirSync(path);//需要用到同步读取
        files.forEach(walk);

        function walk(file) {
            const filePath = Path.join(path, file);
            const states = fs.statSync(filePath);
            if (states.isDirectory()) {
                Utils.readFile(filePath, filesList);
            } else {
                filesList.push(filePath);
            }
        }
    }

    /**
     * 同步复制文件
     * @param src
     * @param dist
     */
    public static copyFile(src, dist): void {
        fs.writeFileSync(dist, fs.readFileSync(src));
    }

    /**
     * 格式化文件大小
     * @param fileSize
     * @param idx
     * @returns {*}
     */
    public static formatFileSize(fileSize, idx = 0): string {
        const units = ["B", "KB", "MB", "GB"];
        if (fileSize < 1024 || idx === units.length - 1) {
            return fileSize.toFixed(1) + units[idx];
        }
        return Utils.formatFileSize(fileSize / 1024, ++idx);
    }

    /**
     * 同步获取文件大小
     * @param path
     */
    public static getFileSize(path): number {
        try {
            const stats = fs.statSync(path);
            return stats.size;
        } catch (e) {
            return -1;
        }
    }

    public static getTempName(filepath): string {
        const baseName = Path.basename(filepath);
        const dir = Path.dirname(filepath);
        return Path.join(dir, 'optemp_' + baseName);
    }

    /**
     * @description determine wehther the object is empty
     * @returns {Boolean}
     * */
    public static isEmptyObject(object): boolean {
        return !Object.getOwnPropertySymbols(object).length && !Object.getOwnPropertyNames(object).length;
    }

    public static log(...string: any[]) {
        if (typeof feflow !== 'undefined') {
            feflow.log.info(...string);
        } else {
            console.log(...string);
        }
    }

    public static error(...string: any[]) {
        if (typeof feflow !== 'undefined') {
            feflow.log.error(...string);
        } else {
            console.error(...string);
        }
    }

}


