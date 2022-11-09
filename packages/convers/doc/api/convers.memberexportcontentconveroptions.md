<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@gby/convers](./convers.md) &gt; [MemberExportContentConverOptions](./convers.memberexportcontentconveroptions.md)

## MemberExportContentConverOptions interface

createMemberExportContentConver 的选项

<b>Signature:</b>

```typescript
export interface MemberExportContentConverOptions 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [name](./convers.memberexportcontentconveroptions.name.md) |  | string | 所要查找（即：需要被替换的）对象的名字 |
|  [onConver?](./convers.memberexportcontentconveroptions.onconver.md) |  | (fileInfo: FileInfo, members: string\[\]) =&gt; void | <i>(Optional)</i> 当发生转换时的回调函数 |
|  [prefix?](./convers.memberexportcontentconveroptions.prefix.md) |  | string \| null | <i>(Optional)</i> 为导出成员生成的蹭变量名的前缀 |
|  [suffix?](./convers.memberexportcontentconveroptions.suffix.md) |  | string \| null | <i>(Optional)</i> 为导出成员生成的蹭变量名的后缀 |
