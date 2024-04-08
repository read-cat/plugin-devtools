export class PluginDevtoolsEventCode {
  /**创建插件开发窗口 */
  static ASYNC_CREATE_PLUGIN_DEVTOOLS_WINDOW: string
  /**关闭插件开发窗口 */
  static ASYNC_CLOSE_PLUGIN_DEVTOOLS_WINDOW: string
  /**插件开发窗口是否最大化 */
  static ASYNC_PLUGIN_DEVTOOLS_WINDOW_IS_MAXIMIZE: string
  /**插件开发窗口最小化 */
  static ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MINIMIZE: string
  /**插件开发窗口最大化或退出最大化 */
  static ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MAXIMIZE_OR_RESTORE: string
  static ASYNC_CONSOLE_LOG: string

  static CLOSE_WINDOW: string
  
  static PLUGIN_BOOKSOURCE_RUN_SEARCH: string
  static PLUGIN_BOOKSOURCE_RUN_GET_DETAIL: string
  static PLUGIN_BOOKSOURCE_RUN_GET_TEXT_CONTENT: string
  
  static PLUGIN_COMPILE: string

  static TEST: string;

  static {
    Object.keys(PluginDevtoolsEventCode).forEach(key => {
      Object.defineProperty(PluginDevtoolsEventCode, key, {
        get() {
          return `PLUGIN_DEVTOOLS_EVENT_CODE_${key}`;
        },
        set() {
          return;
        },
      });
    });
  }
}