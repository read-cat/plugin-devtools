import { createApp } from 'vue';
import App from './App.vue';
import { createPinia, storeToRefs } from 'pinia';
import './assets/style/index.css';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { EventHandler } from './event';
import { PluginDevtoolsEventCode } from './event/event-code';
import { isUndefined } from './is';
import { useMessage } from './hooks/message';
import { useConfigStore } from './store/config';
import eruda, { ErudaConsole } from 'eruda';
import './assets/style/jetbrains-mono-regular.css';

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (['typescript', 'javascript'].includes(label)) {
      return new tsWorker();
    }
    return new EditorWorker();
  },
}
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
if (!location.href.includes('tag=devtools')) {
  Object.defineProperty(window, 'GLOBAL_IPC', {
    get() {
      return {
        on: () => { },
        send: () => { }
      }
    },
  });
}
const { _event } = storeToRefs(useConfigStore());
_event.value = new EventHandler();
GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_CONSOLE_LOG, (_, err, type, logs) => {
  if (!isUndefined(err)) {
    useMessage().error(err);
    return;
  }
  if (
    type === 'log' ||
    type === 'info' ||
    type === 'verbose'
  ) {
    console.log(...logs);
  } else if (type === 'warn') {
    console.warn(...logs);
  } else if (type === 'error') {
    console.error(...logs);
  }
});

const initEruda = () => {
  const container = document.querySelector<HTMLElement>('#console');
  if (!container) {
    return;
  }
  eruda.init({
    container,
    useShadowDom: false,
    tool: ['console'],
    defaults: {
      theme: 'Dark',
    },
  });
  const csl = <ErudaConsole>eruda.get('console');
  csl.config.set('catchGlobalErr', false);
  const style = document.createElement('style');
  style.innerHTML = `
  #eruda {
    width: 350px;
    .eruda-dev-tools {
      padding-top: 29px !important;
    }
    * {
      font-family: JetBrainsMonoRegular;
    }
  }
  .eruda-container {
    z-index: 999 !important;
  }
  .eruda-dev-tools {
    width: 350px !important;
    height: 100% !important;

    .luna-tab-tabs-container {
      height: 29px !important;
      background-color: #3C3C3C;
      -webkit-app-region: drag;
      .luna-tab-item {
        height: 29px !important;
        line-height: 29px !important;
        -webkit-app-region: none;
      }
    }
  }
  #eruda-console .eruda-js-input.eruda-active {
    height: 100px !important;
    padding-top: 0 !important;
    border-top: 1px solid #3d3d3d !important;
  }
  .luna-tab-item[data-id="settings"] {
    display: none !important;
  }
  .eruda-logs-container {
    a {
      pointer-events: none !important;
    }
  }
  `;
  document.head.appendChild(style);
  eruda.show();
  const erudaEle = document.querySelector<HTMLElement>('#eruda');
  erudaEle && (erudaEle.style.all = '');
  document.querySelector('.eruda-entry-btn')?.remove();
}
app.mount('#app').$nextTick(() => {
  initEruda();
  postMessage({ payload: 'removeLoading' }, '*');
});
