import { PluginDevtoolsEventCode } from '../../../event/event-code';
import { useTypeScript } from '../../../hooks/typescript';
import { useMessage } from '../../../hooks/message';
import { isNull, isUndefined } from '../../../is';
import { useConfigStore } from '../../../store/config';
import { ElInput, ElMessageBox } from 'element-plus';
import { h, ref } from 'vue';

export const useDebug = () => {
  const { event } = useConfigStore();
  const { compile } = useTypeScript();
  const message = useMessage();
  (<any>window).booksource_searchkey = '世界';
  (<any>window).booksource_detailPageUrl = null;
  (<any>window).booksource_chapter = null;
  
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
        message.warning('未设置DetailPageUrl');
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
        message.warning('未设置Chapter');
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

  const showSetSearchKeyWindow = () => {
    ElMessageBox.prompt('', '设置 SearchKey', {
      cancelButtonText: '取消',
      confirmButtonText: '设置',
      inputValidator: v => {
        if (!v.trim()) {
          return 'SearchKey为空';
        }
        if (v.trim().length < 2) {
          return 'SearchKey长度小于2';
        }
        return true;
      }
    }).then(({ value }) => {
      (<any>window).booksource_searchkey = value.trim();
      console.log('SearchKey:', (<any>window).booksource_searchkey);
      
    }).catch(() => { });
  }
  const showSetDetailPageUrlWindow = () => {
    ElMessageBox.prompt('', '设置 DetailPageUrl', {
      cancelButtonText: '取消',
      confirmButtonText: '设置',
      inputValidator: v => {
        if (!v.trim()) {
          return 'DetailPageUrl为空';
        }
        if (!/https?:\/\/.*?/.test(v.trim())) {
          return '不是一个规范的链接, 必须以http或https开头';
        }
        return true;
      }
    }).then(({ value }) => {
      (<any>window).booksource_detailPageUrl = value.trim();
      console.log('DetailPageUrl:', (<any>window).booksource_detailPageUrl);
    }).catch(() => { });
  }
  const showSetChapterWindow = () => {
    const titleInput = ref('');
    const urlInput = ref('');
    ElMessageBox({
      title: '设置 Chapter',
      message: () => h('div', {
        style: {
          width: '400px'
        }
      }, [
        h('div', {
          style: {
            display: 'flex'
          }
        }, [
          h('p', {
            style: {
              width: '75px'
            }
          }, '章节标题'),
          h(ElInput, {
            'onUpdate:modelValue': value => titleInput.value = value,
            modelValue: titleInput.value,
            placeholder: '请输入章节标题',
          }),
        ]),
        h('div', {
          style: {
            display: 'flex',
            marginTop: '5px'
          }
        }, [
          h('p', {
            style: {
              width: '75px'
            }
          }, '章节链接'),
          h(ElInput, {
            'onUpdate:modelValue': value => urlInput.value = value,
            modelValue: urlInput.value,
            placeholder: '请输入章节链接',
          }),
        ]),
      ]),
      confirmButtonText: '设置',
      cancelButtonText: '取消',
      showCancelButton: true
    }).then(() => {
      if (!titleInput.value.trim()) {
        message.error('章节标题为空');
        return;
      }
      if (!urlInput.value.trim()) {
        message.error('章节链接为空');
        return;
      }
      if (!/https?:\/\/.*?/.test(urlInput.value.trim())) {
        message.error('不是一个规范的链接, 必须以http或https开头');
        return;
      }
      (<any>window).booksource_chapter = {
        title: titleInput.value.trim(),
        url: urlInput.value.trim()
      };
      console.log('Chapter:', (<any>window).booksource_chapter);
    }).catch(() => { });
  }

  return {
    runSearch,
    runGetDetail,
    runGetTextContent,
    showSetSearchKeyWindow,
    showSetDetailPageUrlWindow,
    showSetChapterWindow
  }
}