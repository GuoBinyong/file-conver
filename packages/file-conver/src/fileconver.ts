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

import {join} from "node:path"

// 进程的执行路径
const processPath = process.cwd();
const relPath = process.argv[2];
// 配置文件的路径
const configPath = join(processPath,relPath);
 
 

import {fileConver} from "./file-conver"

import(configPath).then((config)=>{
    fileConver(config)
 })

 
 
 