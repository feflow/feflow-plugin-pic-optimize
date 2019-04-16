import Utils from "./utils";
import * as Path from 'path';
import compressFile from "./compress";
import CompressInfo from "./compress-info";

/**
 *
 * author: zeyqiao
 * date: 2019-04-14
 */
export default class OptimizePic {
    //打印信息
    static infoList: CompressInfo[] = [];
    static compressedNum: number = 0;
    static skipFilesNum: number = 0;
    static oriTotalSize: number = 0;
    static compressTotalSize: number = 0;

    /**
     * 压缩一个文件
     * @param filePath
     * @return boolean 是否支持压缩
     */
    public static async compressFile(filePath) : Promise<boolean>{
        const compressInfo = await compressFile(filePath);
        return !compressInfo.isNotSupport;
    }

    /**
     * 压缩一个文件夹里的文件
     * @param folderPath
     */
    public static async compressFolder(folderPath) {
        console.log('compressFolder');

        const fileList = Utils.getFileList(folderPath);
        for (let i = 0; i < fileList.length; i++) {
            let file  = fileList[i];
            if (this.fileCanCompress(file)) {
                const compressInfo = await compressFile(file);
                if (typeof compressInfo.isCompressed === 'undefined') {
                    //compress not support.
                    continue;
                }

                if (compressInfo.isCompressed) {
                    this.compressedNum ++;
                    this.oriTotalSize += compressInfo.oriSize;
                    this.compressTotalSize += compressInfo.compressedSize;
                    this.addInfo(compressInfo);
                } else {
                    this.skipFilesNum ++;
                }
            }
        }

        //end log
        Utils.log('\x1b[33m');
        Utils.log(this.getMultiLine(this.console_text));
        Utils.log('\x1b[0m');
        this.printInfo();
        Utils.log(`optimize pic complete, compressed \x1b[32m${this.compressedNum}\x1b[0m files, skiped \x1b[32m${this.skipFilesNum}\x1b[0m files.`);
        Utils.log(`origin size: \x1b[32m${Utils.formatFileSize(this.oriTotalSize)}\x1b[0m, compressed size: \x1b[32m${Utils.formatFileSize(this.compressTotalSize)}\x1b[0m`);
        Utils.log(`SAVED size: \x1b[32m${Utils.formatFileSize(this.oriTotalSize - this.compressTotalSize)}\x1b[0m, \x1b[32m${((this.oriTotalSize - this.compressTotalSize) / this.oriTotalSize * 100).toFixed(2)}%\x1b[0m`);
        Utils.log(this.goodBye());
    }


    private static fileCanCompress(filePath) {
        const baseName = Path.basename(filePath);
        if (baseName.indexOf('optemp_') === 0) {
            Utils.error('temp file not clear:' + filePath);
            return false;
        }
        return true;
    }


    private static console_text() {
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

    private static getMultiLine(f) {
        const lines = f.toString();
        return lines.substring(lines.indexOf("/*") + 3, lines.lastIndexOf("*/"));
    }

    private static addInfo(compressInfo: CompressInfo) {
        this.infoList.push(compressInfo);
        console.log("addinfo:", compressInfo);
    }

    private static printInfo(): void {
        Utils.log("Compressed Files:");
        this.infoList.forEach((info) => {
            Utils.log(`${info.filePath}, ||  \x1b[36m${Utils.formatFileSize(info.oriSize)} --> ${Utils.formatFileSize(info.compressedSize)} \x1b[0m`);
        });
    }


    private static goodBye(): string {
        const byeWords = [
            'Good bye',
            'See you again',
            'Farewell',
            'Have a nice day',
            'Bye!',
            'Catch you later'
        ];
        return byeWords[(Math.random() * byeWords.length) | 0];
    }


}