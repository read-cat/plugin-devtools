import { useMessage } from '../../../hooks/message';
import { useTypeScript } from '../../../hooks/typescript';
import { getErrorMessage } from '../../../utils';
import { isNull, isUndefined } from '../../../is';
import { useConfigStore } from '../../../store/config';
import { PluginDevtoolsEventCode } from '../../../event/event-code';
import { storeToRefs } from 'pinia';
export const useCompile = () => {
  const { compile: tsc } = useTypeScript();
  const message = useMessage();
  const { event } = useConfigStore();
  const { currentFileName } = storeToRefs(useConfigStore());
  const compile = async (debug = false): Promise<void> => {
    try {
      const tscode = monacoEditor.getValue();
      if (!tscode.trim()) {
        return;
      }
      const jscode = await tsc(tscode);
      event.send(PluginDevtoolsEventCode.PLUGIN_COMPILE, debug, jscode);
    } catch (e) {
      console.error(e);
      message.error(getErrorMessage(e));
    }
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_COMPILE, (err, debug, jscode) => {
    if (!isUndefined(err)) {
      console.error(err);
      message.error(err);
      return;
    }
    showSaveFilePicker({
      excludeAcceptAllOption: true,
      suggestedName: currentFileName.value ? `${currentFileName.value}.js` : `plugin_${debug ? 'debug' : 'release'}_${Date.now()}.js`,
      types: [{
        description: 'JavaScript',
        accept: {
          'text/javascript': ['.js']
        }
      }]
    }).catch(() => {
      message.warning('取消保存文件');
      return Promise.resolve(null);
    }).then(async handle => {
      if (isNull(handle)) {
        return;
      }
      const writable = await handle.createWritable();
      await writable.write(jscode);
      await writable.close();
    }).catch(e => {
      message.error(getErrorMessage(e));
    });
  });

  return {
    compile
  }
}