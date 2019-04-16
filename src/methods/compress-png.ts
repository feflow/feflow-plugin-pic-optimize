import Utils from "../utils";
import CompressInfo from "../compress-info";
import * as fs from 'fs';
import {execFileSync} from "child_process";

import * as optipng from 'optipng-bin';
import * as pngcrush from 'pngcrush-bin';
import * as pngquant from 'pngquant-bin';

/**
 *
 * method for compress Png
 * author: zeyqiao
 * date: 2019-04-14
 */
export default class Png {
    private static COMPRESS_THRESHOLD = 0.05;

    public static compress(filePath): CompressInfo {
        const compressInfo = new CompressInfo();
        const log = Utils.log;
        log("compress:" + filePath);
        const tempPath = Utils.getTempName(filePath);
        const oriSize = Utils.getFileSize(filePath);
        compressInfo.oriSize = oriSize;

        let quality;
        if (oriSize < 1000) {
            quality = 100;
        } else {
            quality = 90;
        }
        this.compressByPngquant(filePath, tempPath, quality);

        log('oriSize:', oriSize);
        let tempSize = Utils.getFileSize(tempPath);
        log('compressByPngquant size:', tempSize);
        if (tempSize > 0 && (oriSize - tempSize) / oriSize < this.COMPRESS_THRESHOLD || tempSize < 0) {
            Utils.copyFile(filePath, tempPath);
        }

        tempSize = Utils.getFileSize(tempPath);
        log('compressByPngquant size copy:', tempSize);

        this.compressByPngcrush(tempPath);
        tempSize = Utils.getFileSize(tempPath);
        log('compressByPngcrush size:', tempSize);

        this.compressByOptipng(tempPath);
        tempSize = Utils.getFileSize(tempPath);
        log('compressByOptipng size:', tempSize);

        if (oriSize > tempSize) {
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


    private static compressByPngquant(inputPath, outputPath, quality): void {
        console.log('---compressByPngquant---');
        try {
            const stdout = execFileSync(pngquant, ['--force', '--skip-if-larger', '--verbose', '--strip', '--speed', '3', '--quality', `${quality}`, '-o', outputPath, inputPath]);
            // console.log(stdout);
        } catch (err) {
        }
    }

    private static compressByPngcrush(inputPath): void {
        console.log('---compressByPngcrush---');
        try {
            const stdout = execFileSync(pngcrush, ['-ow', '-noforce', inputPath]);
            // console.log(stdout);
        } catch (e) {

        }
    }

    private static compressByOptipng(inputPath): void {
        console.log('---compressByOptipng---');
        try {
            const stdout = execFileSync(optipng, [inputPath]);
            // console.log(stdout);
        } catch (e) {

        }
    }
}

