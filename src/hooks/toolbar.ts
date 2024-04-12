import { ref } from 'vue';
import { PluginDevtoolsEventCode } from '../event/event-code';
import { ElMessageBox } from 'element-plus';
import { useConfigStore } from '../store/config';

export const useToolbar = () => {
  const { event } = useConfigStore();
  const isFullscreen = ref(false);
  GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_IS_FULLSCREEN_DEVTOOLS_WINDOW, (_, is) => {
    isFullscreen.value = is;
  });

  let isShowCloseWindow = false;
  const closeWindow = () => {
    if (isShowCloseWindow) {
      return;
    }
    isShowCloseWindow = true;
    ElMessageBox.confirm('是否关闭该窗口', {
      confirmButtonText: '关闭',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      event.send(PluginDevtoolsEventCode.CLOSE_WINDOW);
    }).catch(() => {}).finally(() => isShowCloseWindow = false);
  }

  GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_CLOSE_PLUGIN_DEVTOOLS_WINDOW, closeWindow);

  return {
    isFullscreen,
    closeWindow
  }
}