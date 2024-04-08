declare interface PluginType {
  /**
   * 书源类
   */
  BOOK_SOURCE: number;
  /**
   * 书城类
   */
  BOOK_STORE: number;
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
}