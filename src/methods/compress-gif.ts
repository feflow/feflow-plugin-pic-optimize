import Utils from "../utils";
import CompressInfo from "../compress-info";
import * as fs from 'fs';
import {execFileSync} from "child_process";

import * as gifsicle from 'gifsicle';


/**
 *
 * method for compress Gif
 * author: zeyqiao
 * date: 2019-04-14
 */
export default class Gif {
    private static COMPRESS_THRESHOLD = 0.05;

    public static compress(filePath): CompressInfo {
        const compressInfo = new CompressInfo();

        const log = Utils.log;
        log("compress:" + filePath);
        const tempPath = Utils.getTempName(filePath);
        const oriSize = Utils.getFileSize(filePath);
        compressInfo.oriSize = oriSize;

        this.compressByGifsicle(filePath, tempPath);
        let tempSize = Utils.getFileSize(tempPath);

        if (oriSize > tempSize && (oriSize - tempSize) / oriSize > this.COMPRESS_THRESHOLD) {
            Utils.copyFile(tempPath, filePath);
            compressInfo.compressedSize = tempSize;
            compressInfo.isCompressed = true;
            compressInfo.filePath = filePath;
            log("orgin:" + oriSize + ", compressed:" + tempSize);
        } else {
            log('skip..');
            compressInfo.isCompressed = false;
        }
        fs.unlinkSync(tempPath);

        return compressInfo;
    }


    private static compressByGifsicle(inputPath, outputPath) {
        console.log('---compressByGifsicle---');
        console.log(inputPath, outputPath);
        try {
            const stdout = execFileSync(gifsicle, ['-O3', '-o', outputPath, inputPath]);
            console.log(stdout);
        } catch (e) {
            console.log(e);
        }
    }

}

