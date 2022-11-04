#!/usr/bin/env node

/**
 * 批量处理文本文件
 * @remarks
 * 语法
 * ```js
 * 命令 configFilePath
 * ```
 * configFilePath - 配置文件的路径
 */


/**
 * 配置文件的路径
 * @remarks
 * 配置文件可导出以下成员：
 * - input:string  输入路径
 * - encoding?:string  - 文本字符编码
 */
 const configPath = process.argv[2];


import {fileProcessor} from "./file-processor"

import(configPath).then((config)=>{
    fileProcessor(config)
 })

 
 
 