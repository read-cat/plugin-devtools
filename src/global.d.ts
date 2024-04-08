interface IpcRenderer {
  send: (channel: string, ...args: any[]) => void,
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
}

declare const GLOBAL_IPC: IpcRenderer;

type Accept = Record<string, string[]>;
type FileType = {
  /**对此允许文件类型集合的描述 */
  description: string,
  /**带有键名为 MIME 类型、键值为包含文件扩展名的 Array 数组的键值对 */
  accept: Accept
}
type BaseFilePickerOptions = {
  /**忽略选择所有类型文件的过滤选项, 默认false */
  excludeAcceptAllOption?: boolean,
  /**允许选择的文件类型 */
  types?: FileType[]
}
type OpenFilePickerOptions = {
  /**允许用户选择多个文件, 默认false */
  multiple?: boolean
} & BaseFilePickerOptions;
type SaveFilePickerOptions = {
  /**建议的文件名称 */
  suggestedName?: string
} & BaseFilePickerOptions;

declare function showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
declare function showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;

interface Window {
  showOpenFilePicker: typeof showOpenFilePicker,
  showSaveFilePicker: typeof showSaveFilePicker,
  monacoEditor: import('monaco-editor').editor.IStandaloneCodeEditor
}

declare const monacoEditor: import('monaco-editor').editor.IStandaloneCodeEditor;