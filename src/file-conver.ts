
import { readFile, writeFile } from "node:fs/promises"
import { existsSync, mkdirSync, Mode } from "node:fs"
import { join, relative, dirname } from "node:path"
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
     * 输入文件的字符编码
     */
    encoding?: BufferEncoding;

    /**
     * 输出路径
     * 
     * @defaultValue 入口路径 input
     */
    output?: string | null;

    /**
     * 输出文件的字符编码
     * @defaultValue 输入文件的字符编码 encoding
     */
    outEncoding?: BufferEncoding | null;

    /**
     * 输出文件的模式（权限）
     * @remarks
     * 模式选项仅影响新创建的文件。请参阅 fs.open（） 了解更多详情。
     * @defaultValue 0o666
     */
    outMode?: Mode | null

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
    const { input, encoding, output, outEncoding,outMode } = config;
    const inEncoding = encoding ?? "utf8";
    const finalConfig = { ...config, input, encoding: inEncoding, output: output ?? input, outEncoding: outEncoding ?? inEncoding,outMode:outMode ?? undefined };

    const files = getAllFiles(input);
    for await (const path of files) {
        const filePath = relative(input, path);

        fileReadWrite({
            root: input,
            path: filePath,
            encoding: inEncoding,
        }, finalConfig)
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
    encoding?: BufferEncoding|null;

    /**
     * 输出文件的模式（权限）
     * @remarks
     * 模式选项仅影响新创建的文件。请参阅 fs.open（） 了解更多详情。
     * @defaultValue 0o666
     */
    mode?: Mode | null;
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
 * 文件转换器的配置项的必须版本
 */
export type RequiredFileConverConfig = {
    [K in Exclude<keyof FileConverConfig, "outMode">]: NonNullable<FileConverConfig[K]>
} & { outMode?: Mode };

/**
 * 文件读写
 * @param fileMeta 
 * @param convers 
 * @param config 
 */
export async function fileReadWrite(fileMeta: FileMeta, config: RequiredFileConverConfig) {
    const { path, root, encoding } = fileMeta;
    const { output, outEncoding, outMode, convers } = config;

    const inputPath = join(root, path);
    const content = (await readFile(inputPath, { encoding })) as string;
    const inputFileInfo: FileInfo = { ...fileMeta, content };

    const result = convers.reduce((preResult: FileWriteInfo[], conver) => {
        const result = conver(preResult, inputFileInfo, config);
        return result ? (Array.isArray(result) ? result : [result]) : [];
    }, [{ ...inputFileInfo, root: output, encoding: outEncoding ,mode:outMode }]);

    for (const info of result) {
        let { root: wRoot, path: wPath, content: wContent, encoding: wEncoding,mode:wModel } = info;
        wRoot = wRoot ?? output;
        wPath = wPath ?? path;
        wEncoding = wEncoding ?? outEncoding;
        wModel = wModel ?? outMode;

        if (wContent === content && wRoot === root && wPath === path && wEncoding === encoding && !wModel) continue;


        const outPath = join(wRoot, wPath);
        const outDir = dirname(outPath);
        if (!existsSync(outDir)) {
            mkdirSync(outDir, { recursive: true })
        }
        writeFile(outPath, wContent, { encoding: wEncoding,mode:wModel});
    }

}

