## API Report File for "file-conver"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export type ConverResult = FileWriteInfo[] | FileWriteInfo | null | undefined;

// @public
export function createImportConver(objName: string, importPath: string): FileConver;

// @public
export type FileConver = (preConverResult: FileWriteInfo[], fileInfo: FileInfo, config: FileConverConfig) => ConverResult;

// @public
export function fileConver(config: FileConverConfig): Promise<void>;

// @public
export interface FileConverConfig {
    convers: FileConver[];
    encoding?: BufferEncoding;
    input: string;
    output?: string | null;
}

// @public
export interface FileInfo extends FileMeta {
    content: string;
}

// @public
export interface FileMeta {
    encoding?: BufferEncoding;
    path: string;
    root: string;
}

// @public
export function fileReadWrite(fileMeta: FileMeta, convers: FileConver[], config: Required<FileConverConfig>): Promise<void>;

// @public
export type FileWriteInfo = Partial<FileMeta> & Pick<FileInfo, "content">;

// @public
export function getAllFiles(path: string): AsyncGenerator<string, void, unknown>;

// @public
export function getAllFilesOfDir(path: string): AsyncGenerator<string>;

// @public
export function getJoinPath(baseUrl: string | URL, path: string): string;

// (No @packageDocumentation comment for this package)

```