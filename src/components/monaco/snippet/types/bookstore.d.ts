declare type BookStoreItem = {
  /**书名 */
  bookname: string
  /**作者 */
  author?: string
  /**封面 */
  coverImageUrl?: string
  /**简介 */
  intro?: string
}
declare interface BookStore {
  get config(): Record<string, () => Promise<BookStoreItem[]>>
}