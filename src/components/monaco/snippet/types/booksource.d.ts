declare type SearchEntity = {
  /**书名 */
  bookname: string,
  /**作者 */
  author: string,
  /**封面图片链接, 若该链接需通过代理访问,则在该链接后面增加字符串$proxy, 如http://example.com/1.jpg$proxy */
  coverImageUrl?: string,
  /**详情页链接 */
  detailPageUrl: string,
  /**最新章节标题 */
  latestChapterTitle?: string,
}
declare type Chapter = {
  /**章节标题 */
  title: string,
  /**章节链接 */
  url: string
}
declare type DetailEntity = {
  /**书名 */
  bookname: string,
  /**作者 */
  author: string,
  /**封面链接 */
  coverImageUrl: string,
  /**最新章节标题 */
  latestChapterTitle?: string,
  /**简介 */
  intro?: string,
  /**章节目录 */
  chapterList: Chapter[]
}

declare interface BookSource {
  /**
   * 搜索
   * @param searchkey 搜索关键词
   */
  search(searchkey: string): Promise<SearchEntity[]>;
  /**
   * 获取详情页内容
   * @param detailPageUrl 详情页链接
   */
  getDetail(detailPageUrl: string): Promise<DetailEntity>;
  /**
   * 获取正文
   * @param chapter 章节
   * @returns Promise<string[]>
   * string[]中的每个元素代表章节内容的每一段落
   */
  getTextContent(chapter: Chapter): Promise<string[]>;
}