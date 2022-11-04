import {readdir, stat ,readFile,writeFile} from "node:fs/promises"
import { join } from "node:path"

/**
 * 获取路径 path 下的所有文件的路径
 * @param path 
 */
export async function* getAllFiles(path) {

    const inputStats = await stat(path)

    if (inputStats.isDirectory()) {

      yield* await getAllFilesOfDir(path)

    } else {
        yield path
    }

}


/**
 * 获取目录 path 下的所有文件的路径
 * @param path 
 */
export async function* getAllFilesOfDir(path) {
    const dirents = await readdir(path,{withFileTypes:true})

    for (const dirent of dirents) {
        const direntPath = join(path, dirent.name)
        if (dirent.isDirectory()) {
            yield* getAllFilesOfDir(direntPath)
        } else {
            yield direntPath
        }
    }
}



/**
 * 重写文本文件
 * @param {*} path 
 * @param {*} replacer 
 * @param {*} encoding 
 */
export async function rewriteTextFile(path,replacer,encoding){
    encoding = encoding ?? "utf8";
    const text = await readFile(path, {encoding});
    const result = replacer(text)
    return writeFile(path,result, { encoding });
}