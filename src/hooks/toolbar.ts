import { ref } from 'vue';
import { PluginDevtoolsEventCode } from '../event/event-code';
import { ElMessageBox } from 'element-plus';
import { useConfigStore } from '../store/config';

export const useToolbar = () => {
  const { event } = useConfigStore();
  const isMaximize = ref(false);

  GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_PLUGIN_DEVTOOLS_WINDOW_IS_MAXIMIZE, (_, is) => {
    isMaximize.value = is;
  });

  const setMaximizeOrRestore = () => {
    GLOBAL_IPC.send(PluginDevtoolsEventCode.ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MAXIMIZE_OR_RESTORE);
  }
  const setMinimizable = () => {
    GLOBAL_IPC.send(PluginDevtoolsEventCode.ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MINIMIZE);
  }
  const closeWindow = () => {
    ElMessageBox.confirm('是否关闭该窗口', {
      confirmButtonText: '关闭',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      event.send(PluginDevtoolsEventCode.CLOSE_WINDOW);
    }).catch(() => {});
  }

  return {
    isMaximize,
    setMaximizeOrRestore,
    setMinimizable,
    closeWindow
  }
}