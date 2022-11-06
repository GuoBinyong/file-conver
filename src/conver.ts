
import {FileConver} from "./file-conver"


/**
 * 创建替换者，用于将模块成员的使用方式改成 成员导入的使用方式
 * @example
 * ```js
 * createImportConver("Cesium","cesium")
 * ```
 * 会将下面的代码
 * ```js
 * new Cesium.Cartesian3();
 * ```
 * 修改成
 * ```js
 * import {Cartesian3} from "cesium"
 * new Cartesian3();
 * ```
 * 
 * @param objName - 模块名字
 * @param importPath - 模块的导入路径
 * @returns 返回一个文件转换器
 */
export function createImportConver(objName:string, importPath:string):FileConver {

    return function importReplacer(preProcessResult) {

        const fileInfo = preProcessResult.shift();
        if (!fileInfo) return null;

        const content = fileInfo.content as string;

        if (content == null) return null;

        // const cesiumRE = /(?<=\s)objName\s*\.\s*(\w+)\b(?!\s*=[^=])/g ;
        const objNameRE = new RegExp(`(?<=\\s)${objName}\\s*\\.\\s*(\\w+)\\b(?!\\s*=[^=])`, "g");

        const memberSet = new Set();

        let result = content.replaceAll(objNameRE, function (match, member) {
            memberSet.add(member)
            return member
        });

        if (memberSet.size>0){
            const importStr = Array.from(memberSet).join(", ");

            result = `
import {${importStr}} from "${importPath}";

${result}`;
        }

        preProcessResult.unshift({...fileInfo,content:result});
        return preProcessResult;
    }
}