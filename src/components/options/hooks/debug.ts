import { PluginDevtoolsEventCode } from '../../../event/event-code';
import { useTypeScript } from '../../../hooks/typescript';
import { useMessage } from '../../../hooks/message';
import { isNull, isUndefined } from '../../../is';
import { useConfigStore } from '../../../store/config';

export const useDebug = () => {
  const { event } = useConfigStore();
  const { compile } = useTypeScript();
  const message = useMessage();
  (<any>window).booksource_searchkey = '世界';
  (<any>window).booksource_detailPageUrl = null;
  (<any>window).booksource_chapter = null;
  Object.defineProperty(window, 'setSearchKey', {
    get() {
      return (val: string) => ((<any>window).booksource_searchkey = val);
    },
    set(_) {
      return;
    },
  });
  Object.defineProperty(window, 'setDetailPageUrl', {
    get() {
      return (val: string) => ((<any>window).booksource_detailPageUrl = val);
    },
    set(_) {
      return;
    },
  });
  Object.defineProperty(window, 'setChapter', {
    get() {
      return (title: string, url: string) => ((<any>window).booksource_chapter = {
        title,
        url
      });
    },
    set(_) {
      return;
    },
  });

  const run = (callback: (jscode: string) => void) => {
    compile(monacoEditor.getValue()).then(jscode => {
      callback(jscode);
    }).catch(e => {
      message.error('编译错误');
      console.error('编译错误:', e);
    });
  }
  const runSearch = () => {
    run((jscode) => {
      console.log('执行 search', '搜索关键词:', (<any>window).booksource_searchkey);
      event.send(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_SEARCH, (<any>window).booksource_searchkey, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_SEARCH, (err, res) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('执行 search', 'error:', err);
      return;
    }
    console.log('执行 search 结果:', res);
  });
  const runGetDetail = () => {
    run(jscode => {
      const url = (<any>window).booksource_detailPageUrl;
      if (isNull(url)) {
        message.info('请在控制台调用setDetailPageUrl方法设置详情页链接');
        return;
      }
      console.log('执行 getDetail', 'url:', url);
      event.send(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_GET_DETAIL, url, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_GET_DETAIL, (err, res) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('执行 getDetail', 'error:', err);
      return;
    }
    console.log('执行 getDetail 结果:', res);
  });
  const runGetTextContent = () => {
    run(jscode => {
      const chapter = (<any>window).booksource_chapter;
      if (isNull(chapter)) {
        message.info('请在控制台调用setChapter方法设置章节');
        return;
      }
      console.log('执行 getTextContent', 'chapter:', chapter);
      event.send(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_GET_TEXT_CONTENT, chapter, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_BOOKSOURCE_RUN_GET_TEXT_CONTENT, (err, res) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('执行 getTextContent', 'error:', err);
      return;
    }
    console.log('执行 getTextContent 结果:', res);
  });

  return {
    runSearch,
    runGetDetail,
    runGetTextContent
  }
}