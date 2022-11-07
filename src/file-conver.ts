
import { readFile, writeFile } from "node:fs/promises"
import { existsSync, mkdirSync, Mode } from "node:fs"
import { join, relative, dirname,parse,ParsedPath } from "node:path"
import { getAllFiles,Filter } from "./fs-tools.js"


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
     * @remarks
     * 当 encoding 为 null 时，文件的内容会读取为 Buffer 类型，否则会读取为 字符串
     * @defaultValue "utf8"
     */
    encoding?: BufferEncoding | null;
    
    /** {@inheritDoc ./fs-tools.js#Filter} */
    filter?: Filter | null;


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
    outMode?: Mode | null;

    /**
     * 转换器
     */
    conver: FileConver[]|FileConver;

    /**
     * 是否输出内容没有变化的文件
     * 
     * @remarks
     * 当值为 false 时，如果文件内容没有做任务转换，即使 输出路径、输出字符编码、输出文件模式 与原来的不同，也不会输出文件。
     * 
     * @defaultValue false
     */
    emitUnconverted?:boolean;
}



/**
 * 文件的元数据
 */
export interface FileMeta extends ParsedPath {
    // /**
    // * 根目录
    // */
    // root: string;
    /**
     * 资源的全路径
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
    content: FileContent;

}

/**
 * 文件写入选项
 */
export type FileWriteInfo = Partial<Omit<FileMeta,"path">> & Pick<FileInfo, "content">





/**
 * 批量处理文件
 * @param config 
 */
 export async function fileConver(config: FileConverConfig) {
    const { input, encoding,filter ,output, outEncoding,outMode,conver } = config;
    const inEncoding = encoding === undefined ? "utf8" : encoding;
    const convers = Array.isArray(conver) ? conver : [conver];
    const finalConfig = { ...config, input, encoding: inEncoding, output: output ?? input, outEncoding: outEncoding ?? inEncoding,outMode:outMode ?? undefined,conver:convers};

    const files = getAllFiles(input,filter);
    for await (const path of files) {
        const filePath = relative(input, path);
        const pathInfo = parse(filePath);

        fileReadWrite({
            ...pathInfo,
            root: input,
            path,
            encoding: inEncoding,
        }, finalConfig)
    }
}




/**
 * 处理结果
 */
export type ConverResult = FileWriteInfo[] | FileWriteInfo | null | undefined;

/**
 * 文件转换器
 * @remarks
 * 可返回 Promise ，支持异步转换
 * 
 * @returns 当返回 或 `content` 为  null | undefined 时，则不会生成对应的输出文件
 */
export type FileConver = (preConverResult: FileWriteInfo[], fileInfo: FileInfo, config: RequiredFileConverConfig) => ConverResult | Promise<ConverResult>;

/**
 * 文件内容的类型
 */
 export type FileContent = string | Buffer;


/**
 * 文件转换器的配置项的必须版本
 */
export type RequiredFileConverConfig = {
    [K in Exclude<keyof FileConverConfig, "outMode"|"emitUnconverted"|"encoding"|"outEncoding"|"conver"|"filter">]: NonNullable<FileConverConfig[K]>
} & Pick<FileConverConfig,"emitUnconverted"|"encoding"|"outEncoding"|"filter"> & { outMode?: Mode,conver:FileConver[]};

/**
 * 文件读写
 * @param fileMeta 
 * @param convers 
 * @param config 
 */
export async function fileReadWrite(fileMeta: FileMeta, config: RequiredFileConverConfig) {
    const { dir,base,path, encoding } = fileMeta;
    const { output, outEncoding, outMode,emitUnconverted,conver:convers } = config;

    const content = await readFile(path, { encoding });
    const inputFileInfo: FileInfo = { ...fileMeta, content };


    let writeInfoArr:FileWriteInfo[] =  [{ ...inputFileInfo, root: output, encoding: outEncoding ,mode:outMode }];
    for (const conver of  convers){
        const result = await conver(writeInfoArr, inputFileInfo, config);
        writeInfoArr = result ? (Array.isArray(result) ? result : [result]) : [];
    }

    for (const info of writeInfoArr) {
        let { root: wRoot,dir:wDir,name:wName,ext:wExt,base:wBase, content: wContent, encoding: wEncoding,mode:wModel } = info;
        if (wContent == null) continue;
        const isUnconverted = wContent === content;
        if (isUnconverted && !emitUnconverted) continue;

        wRoot = wRoot ?? output;
        wDir = wDir ?? dir;
     
        wEncoding = wEncoding ?? outEncoding;
        wModel = wModel ?? outMode;

        if (wName == null ||  wExt == null){
            wBase = wBase ?? base;
        }else {
            wBase = wName + wExt;
        }

        const outPath = join(wRoot,wDir,wBase);

        if (isUnconverted && outPath === path && wEncoding === encoding && !wModel) continue;

        const outDir = dirname(outPath);
        if (!existsSync(outDir)) {
            mkdirSync(outDir, { recursive: true })
        }
        writeFile(outPath, wContent, { encoding: wEncoding,mode:wModel});
    }

}

