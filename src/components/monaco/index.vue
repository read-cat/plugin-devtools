<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { nextTick } from 'vue';
import ReadCat from './snippet/read-cat';
import Cheerio from './snippet/cheerio';
import Plugin from './snippet/plugin';
import Store from './snippet/store';
import Request from './snippet/request';
import BookSource from './snippet/booksource';
import Is from './snippet/is';
import { isNumber, isString } from '../../is';
import { debounce, getErrorMessage } from '../../utils';
import { useTypeScript } from '../../hooks/typescript';
import { useMessage } from '../../hooks/message';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '../../store/config';
import NodeCrypto from './snippet/crypto.txt?raw';

const props = defineProps<{
  width?: number | string,
  height?: number | string
}>();
let _width = '100%';
let _height = '100%';
if (isString(props.width)) {
  _width = props.width;
} else if (isNumber(props.width) && props.width > 0) {
  _width = `${props.width}px`;
}
if (isString(props.height)) {
  _height = props.height;
} else if (isNumber(props.height) && props.height > 0) {
  _height = `${props.height}px`;
}
const { compile } = useTypeScript();
const { pluginType, saveCode, isSave } = storeToRefs(useConfigStore());
const message = useMessage();
nextTick(() => {
  const container = document.querySelector<HTMLElement>('#code-container');
  if (container) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(Plugin, 'plugin.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(Store, 'store.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(Request, 'request.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(Cheerio, 'cheerio.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(BookSource, 'booksource.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(ReadCat, 'read-cat.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(Is, 'is.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(NodeCrypto, 'crypto.d.ts');
    const editor = monaco.editor.create(container, {
      language: 'typescript',
      value: '',
      theme: 'vs-dark',
      tabSize: 2,
      fontSize: 15,
      fontFamily: 'JetBrainsMonoRegular',
      automaticLayout: true,
      minimap: {
        enabled: false
      }
    });
    document.fonts.addEventListener('loadingdone', () => {
      monaco.editor.remeasureFonts();
    });
    
    const update = debounce(() => {
      compile(editor.getValue()).then(jscode => {
        const plugin = {
          exports: null,
          type: {
            BOOK_SOURCE: 0,
            BOOK_STORE: 1
          }
        }
        try {
          const func = new Function('plugin', jscode);
          func(plugin);
          pluginType.value = isNumber((<any>plugin.exports).TYPE) ? (<any>plugin.exports).TYPE : -1;
        } catch (e) {

        }
      }).catch((e: any) => {
        message.error(`Plugin type detection error: ${getErrorMessage(e)}`);
      });
    }, 1000);
    editor.onDidChangeModelContent(() => {
      update();
      isSave.value = saveCode.value === editor.getValue();
    });
    Object.defineProperty(window, 'monacoEditor', {
      get() {
        return editor;
      },
      set() {
        return;
      },
    })
  }
});
</script>
<script lang="ts">
export default {
  name: 'Monaco'
}
</script>

<template>
  <div id="code-container"></div>
</template>

<style scoped>
#code-container {
  width: v-bind(_width);
  height: v-bind(_height);
}
</style>
./snippet/snippet