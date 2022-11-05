import exp from "node:constants"
import { readdir, stat } from "node:fs/promises"
import { join } from "node:path"

/**
 * 获取路径 path 下的所有文件的路径
 * @param path 
 */
export async function* getAllFiles(path: string) {

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
export async function* getAllFilesOfDir(path: string): AsyncGenerator<string> {
    const dirents = await readdir(path, { withFileTypes: true })

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
 * 获取路径
 * @remarks
 * 返回一个解码后的路径，即：可能带有中文 或 特殊字符的路径
 * 
 * @example
 * ```
 * getJoinPath(import.meta.url,"./src")
 * ```
 * @param baseUrl - 参考的url
 * @param path - 路径
 * @returns 返回一个解码后的路径，即：可能带有中文 或 特殊字符的路径
 */
export function getJoinPath(baseUrl: string | URL, path: string) {
    const url = new URL(path, baseUrl);
    return decodeURI(url.pathname);
}