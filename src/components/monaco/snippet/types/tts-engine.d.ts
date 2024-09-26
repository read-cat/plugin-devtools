declare type Voice = {
  name: string,
  value: string
}

declare type AudioChunk = {
  blob: Blob
  index: number
}

declare type NextCallback = (chunk: AudioChunk, index: number) => void;
declare type EndCallback = () => void;
declare type TTSOptions = {
  /**朗读角色 */
  voice?: string,
  /**
   * 朗读速率 (0~1)
   * @default 0
   */
  rate?: number,
  /**
   * 音量 (0~1)
   * @default 1
   */
  volume?: number,
  /**
   * 起始段落
   * 参数texts的索引
  */
  start?: number,
  /**
   * 中止信号
   */
  signal: AbortSignal
  /**朗读行最大字数 */
  maxLineWordCount?: number
}
declare interface TextToSpeechEngine {
  /**
   * 转换为音频
   */
  transform: (texts: string[], options: TTSOptions, next: NextCallback, end: EndCallback) => Promise<void>
  /**
   * 获取发音人列表
   */
  getVoiceList: () => Promise<Voice[]>
}