
import {FileConver,FileContent} from "./file-conver"





/**
 * 内容转换器
 * @param content - 输入的文件内容
 * @returns 返回转换后的文件内容
 */
export type ContentConver<Content extends FileContent> = (content: Content) => Content| null | undefined;
 
/**
 * 通过内容转换器生成创建文件转换器 
 * @param contentConver - 一个 或 一组内容转换器
 * @returns 文件转换器
 */
export function createConver<Content extends FileContent>(contentConver:ContentConver<Content>[]|ContentConver<Content>):FileConver {
    const contentConvers = Array.isArray(contentConver) ? contentConver : [contentConver];

    return function conver(preProcessResult) {

        const fileInfo = preProcessResult.shift();
        if (!fileInfo) return null;

        let content = fileInfo.content as Content | null | undefined;

        if (content == null) return null;

        for (const contConver of  contentConvers){
            content = contConver(content);
            if (content == null) return null;
        }

        preProcessResult.unshift({...fileInfo,content});
        return preProcessResult;
    }
}

