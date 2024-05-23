const booksourceFunctions = `
  async search(searchkey: string): Promise<SearchEntity[]> {
    /*
      控制台日志打印(仅支持log、info、error、warn、debug方法)
    */
    console.log(searchkey);
  }

  async getDetail(detailPageUrl: string): Promise<DetailEntity> {
    console.log(detailPageUrl);
  }

  async getTextContent(chapter: Chapter): Promise<string[]> {
    console.log(chapter);
  }
`;
const bookstoreFunctions = `

`;

const getFunctionsBody = (type: string) => {
  switch (type) {
    case 'booksource':
      return booksourceFunctions;
    case 'bookstore': 
      return bookstoreFunctions;
    default:
      return '';
  }
}

export const createTemplate = (params: {
  id: string,
  type: string,
  group: string,
  name: string,
  version: string,
  versionCode: number,
  pluginFileUrl: string,
  baseUrl: string
}) => {
  const {
    id,
    type,
    group,
    name,
    version,
    versionCode,
    pluginFileUrl,
    baseUrl
  } = params;
  return `
/**
 * 文件编码: UTF-8(如不是UTF8编码可能会导致乱码或未知错误)
 * 禁止使用import、require导入模块
 * 若使用import * from *、import()、require()导入模块, 无法通过插件校验
 * import fs from 'fs';
 * import('fs').then().catch();
 * require('fs');
 */
plugin.exports = class Plugin implements ${type === 'booksource' ? 'BookSource' : 'BookStore'} {
  /**
   * 静态属性 ID  自动生成
   * 该值需符合正则表达式: [A-Za-z0-9_\-]
   */
  public static readonly ID: string = '${id}';
  /**
   * 静态属性 TYPE  必填
   * 插件类型
   * 值类型:
   * plugin.type.BOOK_SOURCE  - 表示该插件为书源类
   * plugin.type.BOOK_STORE   - 表示该插件为书城类
   */
  public static readonly TYPE: number = ${type === 'booksource' ? 'plugin.type.BOOK_SOURCE' : 'plugin.type.BOOK_STORE'};
  /**
   * 静态属性 GROUP  必填
   * 插件分组
   */
  public static readonly GROUP: string = '${group}';
  /**
   * 静态属性 NAME  必填
   * 插件名称
   */
  public static readonly NAME: string = '${name}';
  /**
   * 静态属性 VERSION  必填
   * 插件版本  用于显示
   */
  public static readonly VERSION: string = '${version}';
  /**
   * 静态属性 VERSION_CODE  必填
   * 插件版本代码  用于比较本地插件与静态属性PLUGIN_FILE_URL所指插件的版本号
   */
  public static readonly VERSION_CODE: number = ${versionCode};
  /**
   * 静态属性 PLUGIN_FILE_URL  必填
   * 插件http、https链接, 如: http://example.com/plugin-template.js
   */
  public static readonly PLUGIN_FILE_URL: string = '${pluginFileUrl}';
  /**
   * 静态属性 BASE_URL  必填
   * 插件请求目标链接
   */
  public static readonly BASE_URL: string = '${baseUrl}';
  /**
   * 静态属性 REQUIRE  可选
   * 要求用户填写的值
   */
  public static readonly REQUIRE: Record<string, string> = {};
  private request: ReadCatRequest;
  private store: Store;
  private cheerio: CheerioModule.load;
  private nanoid: () => string;
  constructor(options: PluginConstructorOptions) {
    const { request, store, cheerio, nanoid } = options;
    /**
     * request
     *   function get(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean } | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理,
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     *   function post(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean }, | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     * 
     *   body: 响应体
     *   code: 响应码
     *   headers: 响应头
     */
    this.request = request;
    /**
     * 每个插件都自带仓库（最大存储4MB）, 您可向该仓库设置、获取、删除值
     * store
     *   function setStoreValue(key, value)
     *               key: string,
     *               value: any (JavaScript基本数据类型), 该值经过v8.serialize处理
     *   return Promise<void>
     *   function getStoreValue(key)
     *               key: string
     *   return Promise<any> (JavaScript基本数据类型)
     *   function removeStoreValue(key)
     *               key: string
     *   return Promise<void>
     */
    this.store = store;
    /**
     * function cheerio(html: string)
     * 该值是模块cheerio中的load方法, 用法 const $ = cheerio(HTMLString)
     * 文档: https://cheerio.nodejs.cn/docs/basics/loading#load
     */
    this.cheerio = cheerio;
    /**
     * function nanoid
     * 获取21位随机字符串
     */
    this.nanoid = nanoid;
  }

  ${getFunctionsBody(type)}
}
`;
}