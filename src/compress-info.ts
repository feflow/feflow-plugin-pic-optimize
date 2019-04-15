/**
 *
 * author: zeyqiao
 * date: 2019-04-14
 */
export default class CompressInfo {
    isCompressed: boolean;//是否被压缩
    oriSize: number;//原始大小
    compressedSize: number; //压缩后的大小
    filePath: string; // 文件路径
    isNotSupport: boolean = false; //是否支持
}