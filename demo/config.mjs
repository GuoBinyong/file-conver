

import {createConver,createESImportContentConver,getJoinPath} from "../dist/index.mjs"


/**
 * 输入路径
 * @remarks
 * 可以是目录，也可以是文件
 * 是绝对路径 或是 相对于 脚本入口文件的相对路径
 */
export const input =  getJoinPath(import.meta.url,"../demo/input");


/**
 * 输入文件的字符编码
 */
export const encoding = "utf-8"


/**
 * 输出路径
 * @remarks
 * 是绝对路径 或是 相对于 脚本入口文件的相对路径
 */
export const output =  getJoinPath(import.meta.url,"../demo/output");



/**
 * cesium 导入方式替换
 */
const import_ContentConver = createESImportContentConver("Cesium","cesium");
const import_Conver = createConver(import_ContentConver);

/**
 * 转换器列表
 */
export const convers  = [import_Conver]