import {readdir, stat } from "node:fs/promises"
import { join } from "node:path"

/**
 * 获取路径 path 下的所有文件的路径
 * @param path 
 */
export async function* getAllFiles(path:string) {

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
export async function* getAllFilesOfDir(path:string):AsyncGenerator<string> {
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

