
import { readFile, writeFile } from "node:fs/promises"
import { existsSync,mkdirSync } from "node:fs"
import { join, relative,dirname } from "node:path"
import { getAllFiles } from "./fs-tools.js"


/**
 * 文件转换器的配置项
 */
export interface FileConverConfig {
    /**
     * 入口路径
     */
    input: string;
    /**
     * 输出路径
     */
    output?: string | null;
    /**
     * 输入文件的字符编码
     */
    encoding?: BufferEncoding;
    /**
     * 转换器列表
     */
    convers: FileConver[]
}


/**
 * 批量处理文件
 * @param config 
 */
export async function fileConver(config: FileConverConfig) {
    const { input, encoding, convers } = config;

    const files = getAllFiles(input)
    for await (const path of files) {
        const filePath = relative(input, path);

        fileReadWrite({
            root: input,
            path: filePath,
            encoding,
        }, convers, config)
    }
}



/**
 * 文件的元数据
 */
export interface FileMeta {
    /**
    * 根目录
    */
    root: string;
    /**
     * 文件的路径
     * @remarks
     * 不能是目录
     */
    path: string;

    /**
     * 文件的字符编码
     * @defaultValue  "utf8"
     */
    encoding?: BufferEncoding
}


/**
 * 文件信息
 */
export interface FileInfo extends FileMeta {
    /**
     * 文件的内容
     */
    content: string;

}

/**
 * 文件写入选项
 */
export type FileWriteInfo = Partial<FileMeta> & Pick<FileInfo, "content">

/**
 * 处理结果
 */
export type ConverResult = FileWriteInfo[] | FileWriteInfo | null | undefined;

/**
 * 文件转换器
 */
export type FileConver = (preConverResult: FileWriteInfo[], fileInfo: FileInfo, config: FileConverConfig) => ConverResult;



/**
 * 文件读写
 * @param fileMeta 
 * @param convers 
 * @param config 
 */
export async function fileReadWrite(fileMeta: FileMeta, convers: FileConver[], config: FileConverConfig) {
    const { path, root, encoding = "utf8" } = fileMeta;
    const inputPath = join(root, path);
    const content = await readFile(inputPath, { encoding });
    const inputFileInfo: FileInfo = { ...fileMeta, content, encoding };

    const result = convers.reduce((preResult: FileWriteInfo[], conver) => {
        const result = conver(preResult, inputFileInfo, config);
        return result ? (Array.isArray(result) ? result : [result]) : [];
    }, [{ ...inputFileInfo }]);

    for (const info of result) {
        let { root: wRoot, path: wPath, content: wContent, encoding: wEncoding = encoding } = info;
        const outPath = join(wRoot ?? root, wPath ?? path);
        const outDir = dirname(outPath);
        if (!existsSync(outDir)){
            mkdirSync(outDir,{recursive:true})
        }
        writeFile(outPath, wContent, { encoding: wEncoding });
    }

}

