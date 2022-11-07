
import {FileConver,FileContent,FileInfo,RequiredFileConverConfig} from "./file-conver"





/**
 * 内容转换器
 * @remarks
 * 如果某个内容转换器返回 null 或 undefined，则后续的内容转换器便不会调用。
 * @param content - 输入的文件内容
 * @returns 返回转换后的文件内容
 */
export type ContentConver<Content extends FileContent> = (content: Content,fileInfo: FileInfo, config: RequiredFileConverConfig) => Content| null | undefined | Promise<Content| null | undefined>;
 
/**
 * 通过一组内容转换器生成创建文件转换器
 * @remarks
 * 如果某个内容转换器返回 null 或 undefined，则后续的内容转换器便不会调用。
 * @param contentConver - 一个 或 一组内容转换器
 * @returns 文件转换器
 */
export function createConver<Content extends FileContent>(contentConver:ContentConver<Content>[]|ContentConver<Content>):FileConver {
    const contentConvers = Array.isArray(contentConver) ? contentConver : [contentConver];

    return async function conver(preConverResult,fileInfo, config) {

        const writeInfo = preConverResult.shift();
        if (!writeInfo) return null;

        let content = writeInfo.content as Content | null | undefined;

        if (content == null) return null;

        for (const contConver of  contentConvers){
            content = await contConver(content,fileInfo, config);
            if (content == null) return null;
        }

        preConverResult.unshift({...writeInfo,content});
        return preConverResult;
    }
}

