declare interface IncomingHttpHeaders {
  accept?: string | undefined;
  'accept-encoding'?: string | undefined;
  'accept-language'?: string | undefined;
  'accept-patch'?: string | undefined;
  'accept-ranges'?: string | undefined;
  'access-control-allow-credentials'?: string | undefined;
  'access-control-allow-headers'?: string | undefined;
  'access-control-allow-methods'?: string | undefined;
  'access-control-allow-origin'?: string | undefined;
  'access-control-expose-headers'?: string | undefined;
  'access-control-max-age'?: string | undefined;
  'access-control-request-headers'?: string | undefined;
  'access-control-request-method'?: string | undefined;
  age?: string | undefined;
  allow?: string | undefined;
  'alt-svc'?: string | undefined;
  authorization?: string | undefined;
  'cache-control'?: string | undefined;
  connection?: string | undefined;
  'content-disposition'?: string | undefined;
  'content-encoding'?: string | undefined;
  'content-language'?: string | undefined;
  'content-length'?: string | undefined;
  'content-location'?: string | undefined;
  'content-range'?: string | undefined;
  'content-type'?: string | undefined;
  cookie?: string | undefined;
  date?: string | undefined;
  etag?: string | undefined;
  expect?: string | undefined;
  expires?: string | undefined;
  forwarded?: string | undefined;
  from?: string | undefined;
  host?: string | undefined;
  'if-match'?: string | undefined;
  'if-modified-since'?: string | undefined;
  'if-none-match'?: string | undefined;
  'if-unmodified-since'?: string | undefined;
  'last-modified'?: string | undefined;
  location?: string | undefined;
  origin?: string | undefined;
  pragma?: string | undefined;
  'proxy-authenticate'?: string | undefined;
  'proxy-authorization'?: string | undefined;
  'public-key-pins'?: string | undefined;
  range?: string | undefined;
  referer?: string | undefined;
  'retry-after'?: string | undefined;
  'sec-websocket-accept'?: string | undefined;
  'sec-websocket-extensions'?: string | undefined;
  'sec-websocket-key'?: string | undefined;
  'sec-websocket-protocol'?: string | undefined;
  'sec-websocket-version'?: string | undefined;
  'set-cookie'?: string[] | undefined;
  'strict-transport-security'?: string | undefined;
  tk?: string | undefined;
  trailer?: string | undefined;
  'transfer-encoding'?: string | undefined;
  upgrade?: string | undefined;
  'user-agent'?: string | undefined;
  vary?: string | undefined;
  via?: string | undefined;
  warning?: string | undefined;
  'www-authenticate'?: string | undefined;
}
declare interface RequestConfig {
  /**请求参数 */
  params?: Record<string, string | number> | URLSearchParams,
  /**请求头 */
  headers?: IncomingHttpHeaders,
  /**是否开启代理 */
  proxy?: boolean,
  /**响应体字符集 默认UTF-8 */
  charset?: 'UTF8' | 'GBK',
  /**请求参数编码 */
  urlencode?: 'UTF8' | 'GBK'
  /**最大重定向数, 0为禁止 */
  maxRedirects?: number,
}
declare interface ReadCatResponse {
  /**响应码 */
  code: number,
  /**响应体 */
  body: string,
  /**响应头 */
  headers: IncomingHttpHeaders
}
declare interface ReadCatRequest {
  /**
   * HTTP GET
   * @param url 请求链接
   * @param config 请求配置
   * @returns 响应体
   */
  get: (url: string, config?: RequestConfig) => Promise<ReadCatResponse>;
  /**
   * HTTP POST
   * @param url 请求链接
   * @param config 请求配置
   * @returns 响应体
   */
  post: (url: string, config?: RequestConfig) => Promise<ReadCatResponse>;
}