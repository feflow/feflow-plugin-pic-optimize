
import * as Path from 'path';
import Png from './methods/compress-png';
import Jpg from './methods/compress-jpg';
import CompressInfo from "./compress-info";
import Gif from "./methods/compress-gif";
import Svg from "./methods/compress-svg";

/**
 * compress a single file
 *
 * author: zeyqiao
 * date: 2019-04-14
 */
export default async function compressFile(filePath): Promise<CompressInfo> {
    const extname = Path.extname(filePath);
    switch (extname) {
        case '.png':
            return Png.compress(filePath);
        case '.jpg':
            return Jpg.compress(filePath);
        case '.gif':
            return Gif.compress(filePath);
        case '.svg':
            return Svg.compress(filePath);
        default:
            const compressInfo = new CompressInfo();
            compressInfo.isNotSupport = true;
            return compressInfo;
    }
}