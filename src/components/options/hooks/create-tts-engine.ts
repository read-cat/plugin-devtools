import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { isNumber } from '../../../is';
import { createTemplate } from '../../../template';
import { nanoid } from 'nanoid';

export const useCreateTTSEngine = () => {
  const showCreateTTSEngine = ref(false);
  const ttsEngineTemplate = ref('');
  const createTTSEngineFormRef = ref<FormInstance>();
  const createTTSEngineForm = reactive({
    group: '',
    name: '',
    version: '',
    versionCode: 0,
    pluginFileUrl: '',
  });

  const createTTSEngineFormRules = reactive<FormRules<typeof createTTSEngineForm>>({
    group: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          createTTSEngineForm.group = '默认';
        } else {
          createTTSEngineForm.group = value.trim();
        }
        callback();
      },
    }],
    name: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          callback('插件名称不能为空');
        } else {
          callback();
        }
      },
    }],
    version: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          callback('插件版本不能为空');
        } else if (!/[\d\w\.\-]+/i.test(value.trim())) {
          callback('只允许输入0-9 A-Z a-z .-_');
        } else {
          callback();
        }
      },
    }],
    versionCode: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (String(value).trim() === '') {
          callback('请输入版本号代码');
        } else if (!isNumber(value)) {
          callback('版本号代码必须是数字类型');
        } else {
          callback();
        }
      },
    }],
    pluginFileUrl: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          callback();
        } else if (/https?:\/\/.*?\.js$/i.test(value.trim())) {
          callback();
        } else {
          callback('不是一个有效的JS文件链接');
        }
      },
    }],

  });
  const submitCreateTTSEngineForm = () => {
    return new Promise<void>(async (reso, reje) => {
      if (!createTTSEngineFormRef.value) {
        return reje();
      }
      await createTTSEngineFormRef.value.validate((valid) => {
        if (!valid) {
          return reje();
        }
        createTTSEngineTemplate();
        return reso();
      });
    });
  }
  const createTTSEngineTemplate = () => {
    ttsEngineTemplate.value = createTemplate({
      id: nanoid(),
      type: 'ttsengine',
      group: createTTSEngineForm.group.trim(),
      name: createTTSEngineForm.name.trim(),
      version: createTTSEngineForm.version.trim(),
      versionCode: createTTSEngineForm.versionCode,
      pluginFileUrl: createTTSEngineForm.pluginFileUrl.trim(),
    });
    showCreateTTSEngine.value = false;
  }


  return {
    showCreateTTSEngine,
    createTTSEngineForm,
    createTTSEngineFormRef,
    submitCreateTTSEngineForm,
    createTTSEngineFormRules,
    ttsEngineTemplate,
    createTTSEngineTemplate
  }
}