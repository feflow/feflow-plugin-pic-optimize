import Utils from "../utils";
import CompressInfo from "../compress-info";
import * as fs from 'fs';
import {execFileSync} from "child_process";

import * as jpegtran from 'jpegtran-bin';
import * as mozjpeg from 'mozjpeg';

/**
 *
 * method for compress jpg
 * author: zeyqiao
 * date: 2019-04-14
 */
export default class Jpg{
    private static COMPRESS_THRESHOLD = 0.05;

    public static compress(filePath): CompressInfo {
        const compressInfo = new CompressInfo();
        const log = Utils.log;
        log("compress:" + filePath);
        const tempPath = Utils.getTempName(filePath);
        const oriSize = Utils.getFileSize(filePath);
        compressInfo.oriSize = oriSize;
        compressInfo.filePath = filePath;

        // compressByJpegtran(filePath, tempPath);
        this.compressByMozjpeg(filePath, tempPath);
        let tempSize = Utils.getFileSize(tempPath);

        if (oriSize > tempSize && (oriSize - tempSize) / oriSize > this.COMPRESS_THRESHOLD) {
            Utils.copyFile(tempPath, filePath);
            compressInfo.compressedSize = tempSize;
            compressInfo.isCompressed = true;
            log("orgin:" + oriSize + ", compressed:" + tempSize);
        } else {
            log('skip..');
            compressInfo.isCompressed = false;
        }

        fs.unlinkSync(tempPath);

        return compressInfo;
    }


    //====jpg===//
    private static compressByJpegtran(inputPath, outputPath) {
        console.log('---compressByJpegtran---');
        try {
            const stdout = execFileSync(jpegtran, ['-progressive', '-copy', 'none', '-optimize', '-outfile', outputPath, inputPath]);
            // console.log(stdout);
        } catch (e) {

        }
    }

    private static  compressByMozjpeg(inputPath, outputPath) {
        console.log('---compressByMozjpeg---');
        try {
            const stdout = execFileSync(mozjpeg, ['-progressive', '-optimize', '-quality', '90', '-outfile', outputPath, inputPath]);
            console.log(stdout);
        } catch (e) {
            console.error(e);
        }
    }


}

