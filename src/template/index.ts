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

const ttsEngineFunctions = `
  async transform(texts: string[], options: TTSOptions, next: NextCallback, end: EndCallback): Promise<void> {
    const {
      signal,
      start,
      maxLineWordCount
    } = options;
    let _maxLineWordCount = isUndefined(maxLineWordCount) || maxLineWordCount < 100 || maxLineWordCount > 300 ? 300 : maxLineWordCount;
    const toBuffer = async (text: string) => {
      // 判断字符串text是否存在中文、英文字母、数字
      if (!/([\\u4e00-\\u9fa5]|[a-z0-9])+/igm.test(text)) {
        return Buffer.alloc(0);
      }
      // 在此处实现文本转语音(Buffer类型)逻辑，并将音频(Buffer)返回
    }
    for (let i = isUndefined(start) ? 0 : start; i < texts.length; i++) {
      if (signal.aborted) {
        break;
      }
      const text = texts[i];
      const chunks = chunkArray(Array.from(text), _maxLineWordCount);
      for (let j = 0; j < chunks.length; j++) {
        const t = chunks[j].join('');
        const body = await toBuffer(t);
        // audio mp3为音频类型，仅支持MP3、WAV、OGG
        next({
          blob: new Blob([body], { type: 'audio/mp3' }),
          index: j
        }, i);
      }
    }
    end();
  }
  async getVoiceList(): Promise<Voice[]> {

  }
`;

export type PluginType = 'booksource' | 'bookstore' | 'ttsengine';

const getFunctionsBody = (type: PluginType) => {
  switch (type) {
    case 'booksource':
      return booksourceFunctions;
    case 'bookstore': 
      return bookstoreFunctions;
    case 'ttsengine':
      return ttsEngineFunctions;
    default:
      return '';
  }
}

const getType = (type: PluginType) => {
  switch (type) {
    case 'ttsengine':
      return 'plugin.type.TTS_ENGINE';
    case 'bookstore':
      return 'plugin.type.BOOK_STORE';
    case 'booksource':
    default:
      return 'plugin.type.BOOK_SOURCE';
  }
}
const getInterface = (type: PluginType) => {
  switch (type) {
    case 'ttsengine':
      return 'TextToSpeechEngine';
    case 'bookstore':
      return 'BookStore';
    case 'booksource':
    default:
      return 'BookSource';
  }
}



export const createTemplate = (params: {
  id: string,
  type: PluginType,
  group: string,
  name: string,
  version: string,
  versionCode: number,
  pluginFileUrl: string,
  baseUrl?: string
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
plugin.exports = class Plugin implements ${getInterface(type)} {
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
   * plugin.type.TTS_ENGINE   - 表示该插件为TTS引擎类
   */
  public static readonly TYPE: number = ${getType(type)};
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
   * 静态属性 BASE_URL  书源、书城类必填
   * 插件请求目标链接
   */
  public static readonly BASE_URL: string = '${baseUrl || ''}';
  /**
   * 静态属性 REQUIRE  可选
   * 要求用户填写的值
   */
  public static readonly REQUIRE: Record<string, string> = {};
  /**
   * 书源类搜索结果过滤器  可选
   */
  public static readonly SEARCH_FILTER: SearchFilter = void 0;
  private request: ReadCatRequest;
  private store: Store;
  private cheerio: CheerioModule.load;
  private nanoid: () => string;
  private uuid: (noDash?: boolean) => string;
  constructor(options: PluginConstructorOptions) {
    const { request, store, cheerio, nanoid, uuid } = options;
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
     *   return Promise<any | null> (JavaScript基本数据类型)
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

    this.uuid = uuid;
  }

  ${getFunctionsBody(type)}
}
`;
}