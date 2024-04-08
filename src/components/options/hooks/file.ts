import { ElMessageBox } from 'element-plus';
import { isNull } from '../../../is';
import { storeToRefs } from 'pinia';
import { useMessage } from '../../../hooks/message';
import { getErrorMessage } from '../../../utils';
import { format } from '../../../utils/date';
import { useConfigStore } from '../../../store/config';

export const useFile = () => {
  const {
    currentFileName,
    currentWritable,
    saveCode,
    isSave,
    pluginType
  } = storeToRefs(useConfigStore());
  const { closeCurrentFile } = useConfigStore();
  const message = useMessage();

  const openFile = () => {
    showOpenFilePicker({
      types: [{
        description: 'TypeScript',
        accept: {
          'text/plain': ['.ts']
        }
      }],
      excludeAcceptAllOption: true,
    }).catch(() => {
      message.warning('取消打开文件');
      return Promise.resolve([null]);
    }).then(async ([handle]) => {
      if (isNull(handle)) {
        return;
      }
      const file = await handle.getFile();
      const text = await file.text();
      const writable = await handle.createWritable();
      ElMessageBox.confirm('是否打开该文件, 打开后将会覆盖当前内容', {
        type: 'warning',
        confirmButtonText: '打开',
        cancelButtonText: '取消'
      }).then(() => {
        closeCurrentFile().catch(e => {
          message.error(e.message);
        }).finally(() => {
          monacoEditor.setValue(text);
          saveCode.value = text;
          isSave.value = true;
          currentFileName.value = file.name;
          currentWritable.value = writable;
          currentWritable.value.write(text);
        });
      }).catch(() => { });
    }).catch(e => {
      message.error(getErrorMessage(e));
    });
  }

  const save = async () => {
    if (!currentWritable.value) {
      return;
    }
    const text = monacoEditor.getValue();
    try {
      await currentWritable.value.truncate(0);
      await currentWritable.value.write({
        type: 'write',
        data: text,
        position: 0,
      });
      saveCode.value = text;
      isSave.value = true;
    } catch (e: any) {
      message.error(e.message);
    }
  }
  window.addEventListener('keydown', e => {
    const { ctrlKey, key } = e;
    if (ctrlKey && key.toLowerCase() === 's') {
      save();
    }
  });

  const saveAs = () => {
    showSaveFilePicker({
      excludeAcceptAllOption: true,
      types: [{
        description: 'TypeScript',
        accept: {
          'text/plain': ['.ts']
        }
      }],
      suggestedName: currentFileName.value ? currentFileName.value : `readcat_plugin_${format(Date.now(), 'yy-MMdd-HHmmss')}.ts`
    }).catch(() => {
      message.warning('取消保存文件');
      return Promise.resolve(null);
    }).then(async handle => {
      if (isNull(handle)) {
        return;
      }
      const file = await handle.getFile();
      const writable = await handle.createWritable();
      await writable.write(monacoEditor.getValue());
      currentFileName.value = file.name;
      isSave.value = true;
      closeCurrentFile().finally(() => {
        currentWritable.value = writable;
      });
      // await writable.close();
    }).catch(e => {
      message.error(getErrorMessage(e));
    });
  }

  const closeFile = () => {
    closeCurrentFile().catch(e => message.error(e.message)).finally(() => {
      isSave.value = false;
      currentFileName.value = null;
      saveCode.value = null;
      monacoEditor.setValue('');
      pluginType.value = -1;
    });
  }

  return {
    openFile,
    saveAs,
    save,
    closeFile
  }

}