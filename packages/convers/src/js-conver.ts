import type { ContentConver ,FileInfo} from "file-conver";
import { parse } from "node:path"



/**
 * createMemberImportContentConver 的选项
 */
export interface MemberImportContentConverOptions {
    /**
     * 模块名字
     */
    name: string;
    /**
     * 模块的导入路径
     */
    path: string;
    /**
     * 是否仅作为类型导入，即 `import type {...} from "..."`
     */
    type?: boolean;

    /**
     * 当发生转换时的回调函数
     * @param fileInfo 被转换的文件的信息
     * @param members 最终生成的导出的成员列表
     */
     onConver?:(fileInfo:FileInfo,members:string[])=>void;
}


/**
 * 创建 用于将模块成员的使用方式改成 成员导入的使用方式 的内容转换器
 * @example
 * ```js
 * createMemberImportContentConver({name:"Cesium",path:"cesium"})
 * ```
 * 会将下面的代码
 * ```js
 * new Cesium.Cartesian3();
 * ```
 * 修改成
 * ```js
 * import {Cartesian3} from "cesium";
 * new Cartesian3();
 * ```
 * 
 * @param options - 选项
 * @returns 返回一个文件转换器
 */
export function createMemberImportContentConver(options:MemberImportContentConverOptions): ContentConver<string> {
    const {name: objName, path: importPath,type} = options;
    // const cesiumRE = /(?<=^\s*|[^.\s]\s+)objName\s*\.\s*(\w+)\b(?!\s*=[^=])/g ;
    const objNameRE = new RegExp(`(?<=^\\s*|[^.\\s]\\s+)${objName}\\s*\\.\\s*(\\w+)\\b(?!\\s*=[^=])`, "g");
    const onConver = options.onConver ?? function(){};

    return function memberImportContentConver(content: string,fileInfo) {

        const memberSet = new Set<string>();

        let result = content.replaceAll(objNameRE, function (match, member) {
            memberSet.add(member)
            return member
        });

        if (memberSet.size > 0) {
            const memberStr = Array.from(memberSet).join(", ");
            const importStr = type ? "import type" : "import";
            result = `${importStr} {${memberStr}} from "${importPath}";
${result}`;
            onConver!(fileInfo,[...memberSet]);
        }

        return result

    }
}



/**
 * createMemberExportContentConver 的选项
 */
export interface MemberExportContentConverOptions {
    /**
     * 所要查找（即：需要被替换的）对象的名字
     */
    name: string;
    /**
     * 为导出成员生成的蹭变量名的前缀
     * @remarks
     * 防止和已有的变量重名
     * @defaultValue "export_"
     */
    prefix?: string | null;
    /**
     * 为导出成员生成的蹭变量名的后缀
     */
    suffix?: string | null;
    /**
     * 当发生转换时的回调函数
     * @remarks
     * 防止和已有的变量重名
     * @param fileInfo 被转换的文件的信息
     * @param members 最终生成的导出的成员列表
     */
    onConver?:(fileInfo:FileInfo,members:string[])=>void;
}


/**
 * 创建 用于将给对象添加成员的方式改成 成员导出的方式 的内容转换器
 * @example
 * ```js
 * createMemberExportContentConver({name:"Cesium",prefix:"export_"})
 * ```
 * 会将下面的代码
 * ```js
 * Cesium.gby = function(){};
 * ```
 * 修改成
 * ```js
 * const export_gby = function(){};
 * export {export_gby as gby}
 * ```
 * 
 * @param options - 选项
 * @returns 返回一个文件转换器
 */
export function createMemberExportContentConver(options:MemberExportContentConverOptions): ContentConver<string> {
    let {name:objName,prefix,suffix,onConver} = options;
    // const cesiumRE = /(?<=^|[;(){}:]\s*)objName\s*\.\s*(\w+)\b(?=\s*=[^=])/g ;
    const objNameRE = new RegExp(`(?<=^|[;(){}:]\\s*)${objName}\\s*\\.\\s*(\\w+)\\b(?=\\s*=[^=])`, "g");
    prefix = prefix ?? "export_";
    suffix = suffix ?? "";
    onConver = onConver ?? function(){};
    return function memberExportContentConver(content: string,fileInfo) {

        const memberMap:{[member: string]:string} = {};

        let result = content.replaceAll(objNameRE, function (match, member) {
            const exportVar = `${prefix}${member}${suffix}`;
            memberMap[member] = exportVar;
            return `const ${exportVar}`;
        });

        const memberVarList = Object.entries(memberMap);
        if (memberVarList.length > 0) {
            const exportList = memberVarList.map(([member, exportVar]) =>{
                return `${exportVar} as ${member}`;
            });
            let exportStr = exportList.join(", ");
            exportStr = `export {${exportStr}};`
            result = `${result}
${exportStr}`;
        onConver!(fileInfo,Object.keys(memberMap));
        }

        return result

    }
}





/**
 * js 标识符（变量名）正则
 */
const jsVarNameRE = /^[a-z$]\w+$/i;

/**
 * js资源导入信息
 */
export interface JsImportInfo {
    /**
     * 导入的路径
     */
    path: string;
    /**
     * 导入的模块名字
     */
    name?: string | null;
}

/**
 * 获取js 导入信息的回调函数类型
 * @param matchingString - 正则匹配的完整字符串
 * @param subString - 正则捕获的子字符串
 * @returns 返回导入所需求的信息
 */
export type GetJsImportInfo = (matchingString: string, ...subString: any[]) => JsImportInfo

/**
 * createPathImportContentConver 的选项
 */
export interface PathImportContentConverOptions {
    /**
     * 查找路径时使用的正则 或 字符串
     * @remarks
     * 当是正则对象时，正则必须带有全局 global 标志，即：`g`
     */
    path: RegExp | string;
    /**
     * 获取 js 导入语句的信息
     * @remarks 
     * 会传入与 pathRE 所匹配的字符串
     */
    getImportInfo: GetJsImportInfo;
    /**
     * 导入变量名的前缀
     */
    prefix?: string | null;
    /**
     * 导入变量名的后缀
     */
    suffix?: string | null;
    /**
     * 是否只导入默认导出项
     */
    defaultExport?: boolean | null;
    
    /**
     * 当发生转换时的回调函数
     * @remarks
     * 防止和已有的变量重名
     * @param fileInfo 被转换的文件的信息
     * @param members 最终生成的导出的成员列表
     */
     onConver?:(fileInfo:FileInfo,pathNameMap:{ [Path: string]: string })=>void;
}


/**
 * 创建 用于将 直接使用 路径的方式替换成 导入的方式的 内容转换器
 * @example
 * 可用于如下内容的转换
 * ```js
 * imgDom.src = "/image/icon.png"
 * ```
 * 修改成
 * ```js
 * import icon from "/image/icon.png";
 * imgDom.src = icon
 * ```
 * 
 * @param options 
 * @returns 
 */
export function createPathImportContentConver(options: PathImportContentConverOptions): ContentConver<string>  {
    const { path: searchPath, getImportInfo, defaultExport, prefix, suffix} = options;

    if (searchPath instanceof RegExp && !searchPath.flags.includes("g")) {
        throw `path选项的正则表达式没有带有 全局 标志 "g"`;
    }

    const importStr = defaultExport ? `import` : `import * as`;

    const onConver = options.onConver ?? function(){};

    /**
     * 路径导入的内容转换器
     */
    return function pathImport_ContentConver(content,fileInfo) {

        // 路径名称映射
        const pathNameMap: { [Path: string]: string } = {};
        // 名字计数映射
        const nameCountMap: { [Name: string]: number } = {};

        content = content.replaceAll(searchPath, function (...subString) {
            let { path, name } = getImportInfo(...subString);
            if (name == null) {
                name = parse(path).name;
            }
            name = name.trim();
            if (!jsVarNameRE.test(name)) {
                name = "anonymity"
            }


            if (prefix) {
                name = prefix + name
            }

            if (suffix) {
                name += suffix;
            }

            let varName = name;
            let count = nameCountMap[name];

            if (count == undefined) {
                count = 1;
            } else {
                varName = `${name}_${++count}`;
            }

            nameCountMap[name] = count;
            pathNameMap[path] = varName;

            return varName
        });


        const importList = Object.entries(pathNameMap).map(([path, varName]) => {
            return `${importStr} ${varName} from "${path}";`;
        });

        if (importList.length) {
            const importStatements = importList.join("\n");
            content = `${importStatements}
${content}`;
            onConver!(fileInfo,pathNameMap);
        }

        return content;
    }

}


