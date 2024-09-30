declare interface PluginType {
  /**
   * 书源类
   */
  BOOK_SOURCE: number;
  /**
   * 书城类
   */
  BOOK_STORE: number;
  /**TTS引擎 */
  TTS_ENGINE: number;
}
declare interface PluginExports {
  /**
   * 导出插件
   */
  exports: any,
  /**
   * 插件类型
   */
  type: PluginType
}
declare const plugin: PluginExports;

declare interface PluginConstructorOptions {
  request: ReadCatRequest;
  store: Store;
  cheerio: CheerioModule.load;
  nanoid: () => string;
  uuid: (noDash?: boolean) => string;
}

declare type SearchFilter = boolean | undefined | ((entity: SearchEntity, searchKey: string, author?: string) => boolean);

declare type RequireItem = {
  /**要显示的设置项标签 */
  label: string
  /**设置项类型 */
  type: 'number' | 'string' | 'list' | 'password' | 'boolean'
  /**设置项的值 */
  value?: any
  /**必须，设置项默认值，不设置value时作为值使用 */
  default: any
  /**可选，type为list时必须 */
  data?: Array<{ id: any, name: any }>
  /**可选，设置项的说明 */
  description?: string
  /**可选，设置项的输入提示 */
  placeholder?: string
}