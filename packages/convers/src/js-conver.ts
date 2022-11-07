import type {ContentConver} from "file-conver";


/**
 * 创建 用于将模块成员的使用方式改成 成员导入的使用方式 的内容转换器
 * @example
 * ```js
 * createESImportContentConver("Cesium","cesium")
 * ```
 * 会将下面的代码
 * ```js
 * new Cesium.Cartesian3();
 * ```
 * 修改成
 * ```js
 * import {Cartesian3} from "cesium";
 * 
 * new Cartesian3();
 * ```
 * 
 * @param objName - 模块名字
 * @param importPath - 模块的导入路径
 * @param type - 是否仅作为类型导入，即 `import type {...} from "..."`
 * @returns 返回一个文件转换器
 */
 export function createESImportContentConver(objName:string, importPath:string,type?:boolean):ContentConver<string> {

    return function esImportContentConver(content:string) {

        // const cesiumRE = /(?<=\s)objName\s*\.\s*(\w+)\b(?!\s*=[^=])/g ;
        const objNameRE = new RegExp(`(?<=\\s)${objName}\\s*\\.\\s*(\\w+)\\b(?!\\s*=[^=])`, "g");

        const memberSet = new Set();

        let result = content.replaceAll(objNameRE, function (match, member) {
            memberSet.add(member)
            return member
        });

        if (memberSet.size>0){
            const memberStr = Array.from(memberSet).join(", ");
            const importStr = type ? "import type" : "import";
            result = `${importStr} {${memberStr}} from "${importPath}";
${result}`;
        }

        return result

    }
}