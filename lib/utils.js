const fs = require('fs');
const path = require('path');
const InPath = path;


/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * @param pathCallBack 文件一个个回调，异步的
 */
function folderWalk(filePath, pathCallBack){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            console.log(walkingSize);
            //遍历读取到的文件列表
            files.forEach(function(filename ,index, array){
                //获取当前文件的绝对路径
                let filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        let isFile = stats.isFile();//是文件
                        let isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            pathCallBack(filedir);
                        }
                        if(isDir){
                            folderWalk(filedir, pathCallBack);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}


/**
 *
 * @param path
 * 递归创建文件夹，总能创建出来的，放心
 */
function mkdirRecursively(path) {
    mkdir(path)
}

//使用时第二个参数可以忽略
function mkdir(dirpath,dirname){
    //判断是否是第一次调用
    if(typeof dirname === "undefined"){
        if(fs.existsSync(dirpath)){
            return;
        }else{
            mkdir(dirpath,path.dirname(dirpath));
        }
    }else{
        //判断第二个参数是否正常，避免调用时传入错误参数
        if(dirname !== path.dirname(dirpath)){
            mkdir(dirpath);
            return;
        }
        if(fs.existsSync(dirname)){
            fs.mkdirSync(dirpath)
        }else{
            mkdir(dirname,path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}


/**
 * 同步获取所有文件列表
 * @param path
 * @returns {Array}
 */
function getFileList(path)
{
    var filesList = [];
    readFile(path,filesList);
    return filesList;
}

//遍历读取文件
function readFile(path,filesList)
{
    files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file)
    {
        const filePath = InPath.join(path,file);
        states = fs.statSync(filePath);
        if(states.isDirectory())
        {
            readFile(filePath,filesList);
        }
        else
        {
            filesList.push(filePath);
        }
    }
}


/**
 * 同步复制文件
 * @param src
 * @param dist
 */
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}

/**
 * 格式化文件大小
 * @param fileSize
 * @param idx
 * @returns {*}
 */
function formatFileSize(fileSize, idx = 0) {
    const units = ["B", "KB", "MB", "GB"];
    if (fileSize < 1024 || idx === units.length - 1) {
        return fileSize.toFixed(1) + units[idx];
    }
    return formatFileSize(fileSize / 1024, ++idx);
}

/*
 * @description determine wehther the object is empty
 * @returns {Boolean}
 */
function isEmptyObject(object) {
    return !Object.getOwnPropertySymbols(object).length && !Object.getOwnPropertyNames(object).length;
}

/* 
 * @description mock feflow
 * @returns {Object}
 */
function initFeflow() {
    return {
        log: {
            info: function(msg) {
                console.log(msg);
            },
            error: function(msg) {
                console.error(msg)
            }
        }
    }
}

function firstUpperCase(str) {
    return str.toLowerCase().replace(/^\S/g, function (s) { return s.toUpperCase(); });
}


module.exports = {
    folderWalk,
    mkdirRecursively,
    copyFile,
    formatFileSize,
    getFileList,
    isEmptyObject,
    initFeflow,
    firstUpperCase
};