import { PluginDevtoolsEventCode } from '../../../../event/event-code';
import { useMessage } from '../../../../hooks/message';
import { isUndefined } from '../../../../is';
import { useConfigStore } from '../../../../store/config';
import { run } from '.';

export const useDebugBookStore = () => {
  const { event } = useConfigStore();
  const message = useMessage();

  const runBookStore = (key: string) => {
    run((jscode) => {
      console.log('执行', key);
      event.send(PluginDevtoolsEventCode.PLUGIN_BOOKSTORE_RUN, key, jscode);
    });
  }
  event.on(PluginDevtoolsEventCode.PLUGIN_BOOKSTORE_RUN, (err, res) => {
    if (!isUndefined(err)) {
      message.error(err);
      console.error('error:', err);
      return;
    }
    console.log('执行 结果:', res);
  });
  

  return {
    runBookStore,
  }
}