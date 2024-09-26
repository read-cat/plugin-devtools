import { PluginDevtoolsEventCode } from '../../../../event/event-code';
import { useMessage } from '../../../../hooks/message';
import { isUndefined } from '../../../../is';
import { useConfigStore } from '../../../../store/config';
import { ElMessageBox, ElInput } from 'element-plus';
import { run } from '.';
import { h, ref } from 'vue';

export const useDebugTTSEngine = () => {
  const { event } = useConfigStore();
  const message = useMessage();

  (<any>window).ttsengine_text = '这是一段正在朗读的文字';

  const showSetVoiceWindow = () => {
    ElMessageBox.prompt('', '设置 Voice', {
      cancelButtonText: '取消',
      confirmButtonText: '设置',
      inputValidator: v => {
        if (!v.trim()) {
          return 'Voice为空';
        }
        return true;
      }
    }).then(({ value }) => {
      (<any>window).ttsengine_voice = value.trim();
      console.log('Voice:', (<any>window).ttsengine_voice);

    }).catch(() => { });
  }
  const showSetTextWindow = () => {
    const input = ref('');
    ElMessageBox({
      message: () => h('div', {
        onVnodeMounted(vnode) {
          const parent = (<HTMLElement>vnode.el).parentElement;
          parent && (parent.style.width = '100%');
        },
      }, [
        h('p', {
          style: {
            marginBottom: '10px',
            fontSize: '16px'
          }
        }, '设置 朗读文本'),
        h(ElInput, {
          type: 'textarea',
          modelValue: input.value,
          'onUpdate:modelValue': val => input.value = val,
          resize: 'none',
          autofocus: true,
          rows: 5,
          style: {
            width: '100%'
          }
        })
      ]),
      cancelButtonText: '取消',
      confirmButtonText: '设置',
      showCancelButton: true
    }).then(() => {
      (<any>window).ttsengine_text = input.value.trim();
      console.log('文本:', (<any>window).ttsengine_text);
    }).catch(() => {});
  }

  const runTransform = () => {
    const texts = (<string>(<any>window).ttsengine_text)
      .split('\n')
      .map(t => t.trim())
      .filter(t => t);
    run(jscode => {
      console.log('执行 transform');
      event.send(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_RUN_TRANSFORM, texts, (<any>window).ttsengine_voice, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_RUN_TRANSFORM, (err) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('执行 transform', 'error:', err);
      return;
    }
    console.log('执行 transform 完成');
  });
  event.on(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_TRANSFORM_NEXT_CALLBACK, (_, res) => {
    const { chunk, index } = res;
    console.log('transform next, index:', index, 'chunk:', chunk);
  });
  event.on(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_TRANSFORM_END_CALLBACK, () => {
    console.log('transform end');
  });
  event.on(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_ABORT_TRANSFORM, () => {
    console.log('transform abort');
  });

  const runGetVoiceList = () => {
    run(jscode => {
      console.log('执行 getVoiceList');
      event.send(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_RUN_GET_VOICE_LIST, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_TTS_ENGINE_RUN_GET_VOICE_LIST, (err, res) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('执行 getVoiceList', 'error:', err);
      return;
    }
    console.log('执行 getVoiceList 结果:', res);
  });

  return {
    showSetVoiceWindow,
    showSetTextWindow,
    runTransform,
    runGetVoiceList,
  }
}