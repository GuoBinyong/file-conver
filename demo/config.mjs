

import {createImportConver} from "../dist/index.mjs"


/**
 * 输入路径
 * @remarks
 * 可以是目录，也可以是文件
 * 是绝对路径 或是 相对于 脚本入口文件的相对路径
 */
export const input =  "../demo/input"


/**
 * 文本文件的字符编码
 */
export const encoding = "utf-8"







/**
 * cesium 导入方式替换
 */
const cesiumConver = createImportConver("Cesium","cesium");

/**
 * 转换器列表
 */
export const convers  = [cesiumConver]