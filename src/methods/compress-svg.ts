/*
 * @Author: salomezhang
 * @Description: compress svg
 * @Date: 2019-04-09 19:02:33
 */

import Utils from "../utils";
import CompressInfo from "../compress-info";
import * as fs from 'fs';
import * as SVGO from 'svgo';

export default class svg {
    private static svgo = new SVGO();

    public static async compress(filePath): Promise<CompressInfo> {
        const log = Utils.log;
        log("compress:" + filePath);

        const oriSize = Utils.getFileSize(filePath);
        let data = fs.readFileSync(filePath, 'utf-8');
        let result = await this.svgo.optimize(data, { path: filePath });
        fs.writeFileSync(filePath, result.data);

        const compressSize = Utils.getFileSize(filePath);

        const compressInfo = new CompressInfo();
        compressInfo.oriSize = oriSize;
        compressInfo.compressedSize = compressSize;
        compressInfo.filePath = filePath;
        compressInfo.isCompressed = compressSize < oriSize;
        log('compressBySvgo size:', compressSize);

        return compressInfo;
    }
}

