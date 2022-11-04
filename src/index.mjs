/**
 * 批量处理文本文件
 * @remarks
 * ```js
 * node index.mjs ./config.mjs
 * ```
 */


/**
 * 配置文件的路径
 * @remarks
 * 配置文件可导出以下成员：
 * - input:string  输入路径
 * - encoding?:string  - 文本字符编码
 */
 const configPath = process.argv[2];


import {processTextFiles} from "./processTextFiles.mjs"
 import {createRewriter} from "./processor.mjs"
 import {cesiumReplacer} from "./replacer.mjs"
 
 const config = await import(configPath)
 

 processTextFiles(createRewriter(cesiumReplacer),config)
 
 
 