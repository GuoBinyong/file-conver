import { readdir, stat } from "node:fs/promises"
import type {Dirent} from "node:fs"
import { join } from "node:path"


/**
 * 资源过滤器
 * @remarks
 * 可用于筛选被转换的文件
 * @param dirent - 具体资源的信息
 * @param path - 当前资源所在的目录路径
 * @return 返回的值表示是否要转换该资源：真值：转换；假值：不转换
 */
export type Filter = (dirent:Dirent,path:string)=> boolean| null | undefined;



/**
 * 获取路径 path 下的所有文件的路径
 * @param path 
 * @param filter - 资源过滤器
 */
export async function* getAllFiles(path: string,filter?:Filter|null) {

    const inputStats = await stat(path)

    if (inputStats.isDirectory()) {

        yield* await getAllFilesOfDir(path,filter)

    } else {
        yield path
    }

}


/**
 * 获取目录 path 下的所有文件的路径
 * @param path 
 * @param filter - 资源过滤器
 */
export async function* getAllFilesOfDir(path: string,filter?:Filter|null): AsyncGenerator<string> {
    filter = filter ?? function() { return true};
    const dirents = await readdir(path, { withFileTypes: true });

    for (const dirent of dirents) {
        if (filter(dirent,path)){

            const direntPath = join(path, dirent.name)
            if (dirent.isDirectory()) {
                yield* getAllFilesOfDir(direntPath,filter)
            } else {
                yield direntPath
            }

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