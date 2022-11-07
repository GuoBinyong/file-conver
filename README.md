[教程]: ./doc/教程.md
[API接口文档]: ./doc/api/index.md

[GitHub仓库]: https://github.com/GuoBinyong/file-conver
[发行地址]: https://github.com/GuoBinyong/file-conver/releases
[issues]: https://github.com/GuoBinyong/file-conver/issues

[码云仓库]: https://gitee.com/guobinyong/file-conver



> 目录

- [1. 背景](#1-背景)
- [2. 简介](#2-简介)
- [3. 安装方式](#3-安装方式)
- [4. 教程](#4-教程)
- [5. API接口文档](#5-api接口文档)



# 1. 背景
当需要对旧项目进行改造，改造过程中需要很多重复的操作，比如：  
   将下面全局的模块使用方式：  
   ```js
   new Cesium.Cartesian3();
   ```
   改成成员导入方式：  
   ```js
   import {Cartesian3} from "cesium"
   new Cartesian3();
   ```
借助正则，这些都可以通过代码来操作。但对于不熟悉 Node 的同学，写一个批量处理这些文件的工具还是比较耗时的，优其只是偶尔用一下的时候。

所以，为了方便没有 Node 经验的同学能够快速实现自己的处理脚本，所以本工具就诞生了。
# 2. 简介
file-conver 用于批量处理文件，可自定义处理逻辑。它提供了遍历文件、读取文件 和 写入文件 的能力，提供了链式的自定义处理器逻辑，可以让用户方便的自定义 和 拆分 处理逻辑。并且支持一个文件转换成多个文件的机制。

**具有以下特性：**  
- 批量处理文件
- 链式的自定义处理逻辑，方便自定义 和 拆分处理逻辑
- 带有命令行工具，并且支持配置文件
- 支持一个文件转换成多个文件的机制
- 支持异步转换
- 支持 JSAPI 调用

**详情请看：**  
- 主页：<https://github.com/GuoBinyong/file-conver>
- [GitHub仓库][]
- [码云仓库][]
- [教程][]
- [API接口文档][]


**如果您在使用的过程中遇到了问题，或者有好的建议和想法，您都可以通过以下方式联系我，期待与您的交流：**
- 给该仓库提交 [issues][]
- 给我 Pull requests
- 邮箱：<guobinyong@qq.com>
- QQ：guobinyong@qq.com
- 微信：keyanzhe





# 3. 安装方式
通过 npm （或 yarn、pnpm 等包管理器）安装
```
npm install file-conver
```


# 4. 教程
详情跳转至[教程][]

# 5. API接口文档
详情跳转至[API接口文档][]



--------------------

> 有您的支持，我会在开源的道路上，越走越远

![赞赏码](https://i.loli.net/2020/04/08/PGsAEqdJCin1oQL.jpg)