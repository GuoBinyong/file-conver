
import { readFile, writeFile } from "node:fs/promises"
import { join, relative } from "node:path"
import { getAllFiles } from "./fs-tools.js"


/**
 * 文件处理器的配置项
 */
export interface FileProcessorConfig {
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
     * 处理器列表
     */
    processors: FileProcessor[]
}


/**
 * 批量处理文件
 * @param config 
 */
export async function fileProcessor(config: FileProcessorConfig) {
    const { input, encoding, processors } = config;

    const files = getAllFiles(input)
    for await (const path of files) {
        const filePath = relative(input, path);

        fileReadWrite({
            root: input,
            path: filePath,
            encoding,
        }, processors, config)
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
export type ProcessResult = FileWriteInfo[] | FileWriteInfo | null | undefined;

/**
 * 文件处理器
 */
export type FileProcessor = (preProcessResult: FileWriteInfo[], fileInfo: FileInfo, config: FileProcessorConfig) => ProcessResult;



/**
 * 文件读写
 * @param fileMeta 
 * @param processors 
 * @param config 
 */
export async function fileReadWrite(fileMeta: FileMeta, processors: FileProcessor[], config: FileProcessorConfig) {
    const { path, root, encoding = "utf8" } = fileMeta;
    const inputPath = join(root, path);
    const content = await readFile(inputPath, { encoding });
    const inputFileInfo: FileInfo = { ...fileMeta, content, encoding };

    const result = processors.reduce((preResult: FileWriteInfo[], processor) => {
        const result = processor(preResult, inputFileInfo, config);
        return result ? (Array.isArray(result) ? result : [result]) : [];
    }, [{ ...inputFileInfo }]);

    for (const info of result) {
        let { root: wRoot, path: wPath, content: wContent, encoding: wEncoding = encoding } = info;
        const outPath = join(wRoot ?? root, wPath ?? path);
        writeFile(outPath, wContent, { encoding: wEncoding });
    }

}

