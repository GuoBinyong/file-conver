import { rewriteTextFile } from "./fs-tools.mjs"

/**
 * 创建文件重写者
 * @param {*} replacer 
 * @returns 
 */
export function createRewriter(replacer) {
    return function rewriter(path, encoding) {
        return rewriteTextFile(path, replacer, encoding)
    }
}




/**
 * 创建替换者，用于将模块成员的使用方式改成 成员导入的使用方式
 * @remarks
 * 如 `Cesium.Cartesian3` 改成 `import {Cartesian3} from "cesium"`
 * 
 * @param {string} objName - 如 Cesium
 * @param {string} importPath - 如 cesium
 * @returns 
 */
export function createImportReplacer(objName, importPath) {
    /**
     * 将模块成员的使用方式改成 成员导入的使用方式
     * @remarks
     * 如 `Cesium.Cartesian3` 改成 `import {Cartesian3} from "cesium"`
     * @param {*} text 
     * @returns 
     */
    return function importReplacer(text) {

        // const cesiumRE = /(?<=\s)objName\.(\w+)\b(?!\s*=[^=])/g ;
        const cesiumRE = new RegExp(`(?<=\\s)${objName}\\.(\\w+)\\b(?!\\s*=[^=])`, "g");

        const memberSet = new Set();

        let result = text.replaceAll(cesiumRE, function (match, member) {
            memberSet.add(member)
            return member
        });

        if (memberSet.size>0){
            const importStr = Array.from(memberSet).join(", ");

            result = `
import {${importStr}} from "${importPath}";

${result}`;
        }



        return result;
    }
}