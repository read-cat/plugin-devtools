import { ref } from 'vue';
import { PluginDevtoolsEventCode } from '../event/event-code';
import { ElMessageBox } from 'element-plus';
import { useConfigStore } from '../store/config';
import { isError } from '../is';
import { useMessage } from './message';
import { storeToRefs } from 'pinia';

export const useToolbar = () => {
  const { event } = useConfigStore();
  const { currentWritable, platform } = storeToRefs(useConfigStore());
  const isMaximize = ref(false);
  const isFullscreen = ref(false);
  const message = useMessage();
  GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_IS_FULLSCREEN_DEVTOOLS_WINDOW, (_, is) => {
    isFullscreen.value = is;
  });
  GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_PLUGIN_DEVTOOLS_WINDOW_IS_MAXIMIZE, (_, is) => {
    isMaximize.value = is;
  });

  const setMaximizeOrRestore = () => {
    GLOBAL_IPC.send(PluginDevtoolsEventCode.ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MAXIMIZE_OR_RESTORE);
  }
  const setMinimizable = () => {
    GLOBAL_IPC.send(PluginDevtoolsEventCode.ASYNC_SET_PLUGIN_DEVTOOLS_WINDOW_MINIMIZE);
  }
  let isShowCloseWindow = false;
  const closeWindow = async () => {
    if (isShowCloseWindow) {
      return;
    }
    isShowCloseWindow = true;
    try {
      await ElMessageBox.confirm('是否关闭该窗口', {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'info'
      });
      if (currentWritable.value) {
        await currentWritable.value.close();
      }
      event.send(PluginDevtoolsEventCode.CLOSE_WINDOW);
    } catch (e) {
      isError(e) && message.error(e.message);
    } finally {
      isShowCloseWindow = false;
    }
  }

  if (platform.value !== 'linux') {
    GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_CLOSE_PLUGIN_DEVTOOLS_WINDOW, async () => {
      try {
        currentWritable.value && await currentWritable.value.close();
      } catch (error) { } finally {
        event.send(PluginDevtoolsEventCode.CLOSE_WINDOW);
      }
    });
  } else {
    GLOBAL_IPC.on(PluginDevtoolsEventCode.ASYNC_CLOSE_PLUGIN_DEVTOOLS_WINDOW, closeWindow);
  }

  return {
    isMaximize,
    setMaximizeOrRestore,
    setMinimizable,
    isFullscreen,
    closeWindow
  }
}