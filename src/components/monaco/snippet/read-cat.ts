const snippet = `
declare interface SearchEntity {
  //书名
  bookname: string,
  //作者
  author: string,
  //封面图片链接
  coverImageUrl?: string,
  //详情页链接
  detailPageUrl: string,
  //最新章节标题
  latestChapterTitle?: string,
}
declare interface Chapter {
  title: string,
  url: string
}
declare interface DetailEntity {
  bookname: string,
  author: string,
  coverImageUrl: string,
  latestChapterTitle?: string,
  intro?: string,
  chapterList: Chapter[]
}
`;
export default snippet;