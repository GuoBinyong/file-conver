
import {FileProcessor} from "./file-processor"


/**
 * 创建替换者，用于将模块成员的使用方式改成 成员导入的使用方式
 * @example
 * ```js
 * createImportProcessor("Cesium","cesium")
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
 * @returns 返回一个文件处理器
 */
export function createImportProcessor(objName:string, importPath:string):FileProcessor {

    return function importReplacer(preProcessResult) {

        const fileInfo = preProcessResult[0];
        const {context} = fileInfo;

        // const cesiumRE = /(?<=\s)objName\.(\w+)\b(?!\s*=[^=])/g ;
        const objNameRE = new RegExp(`(?<=\\s)${objName}\\.(\\w+)\\b(?!\\s*=[^=])`, "g");

        const memberSet = new Set();

        let result = context.replaceAll(objNameRE, function (match, member) {
            memberSet.add(member)
            return member
        });

        if (memberSet.size>0){
            const importStr = Array.from(memberSet).join(", ");

            result = `
import {${importStr}} from "${importPath}";

${result}`;
        }

        const finalResult = preProcessResult.slice(1)
        finalResult.unshift({...fileInfo,context:result});
        return finalResult;
    }
}