
import { getAllFiles } from "./fs-tools.mjs"

/**
 * 处理文件文件
 * @param {*} processor 
 * @param {{ input:string,encoding?:string}} config 
 */
export async function processTextFiles(processor,config) {
    const { input,encoding } = config;

    const files = getAllFiles(input)
    for await (const path of files) {
        processor(path,encoding)
        console.log(path)
    }
}


