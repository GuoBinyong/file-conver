## API Report File for "file-processor"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function createImportProcessor(objName: string, importPath: string): FileProcessor;

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
export type FileProcessor = (preProcessResult: FileWriteInfo[], fileInfo: FileInfo, config: FileProcessorConfig) => ProcessResult;

// @public
export function fileProcessor(config: FileProcessorConfig): Promise<void>;

// @public
export interface FileProcessorConfig {
    encoding?: BufferEncoding;
    input: string;
    output?: string | null;
    processors: FileProcessor[];
}

// @public
export function fileReadWrite(fileMeta: FileMeta, processors: FileProcessor[], config: FileProcessorConfig): Promise<void>;

// @public
export type FileWriteInfo = Partial<FileMeta> & Pick<FileInfo, "content">;

// @public
export function getAllFiles(path: string): AsyncGenerator<string, void, unknown>;

// @public
export function getAllFilesOfDir(path: string): AsyncGenerator<string>;

// @public
export type ProcessResult = FileWriteInfo[] | FileWriteInfo | null | undefined;

// (No @packageDocumentation comment for this package)

```
