import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { isNumber } from '../../../is';
import { createTemplate } from '../../../template';
import { nanoid } from 'nanoid';

export const useCreateBookStore = () => {
  const showCreateBookStore = ref(false);
  const bookStoreTemplate = ref('');
  const createBookStoreFormRef = ref<FormInstance>();
  const createBookStoreForm = reactive({
    group: '',
    name: '',
    version: '',
    versionCode: 0,
    pluginFileUrl: '',
    baseUrl: '',
  });

  const createBookStoreFormRules = reactive<FormRules<typeof createBookStoreForm>>({
    group: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          createBookStoreForm.group = '默认';
        } else {
          createBookStoreForm.group = value.trim();
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
    baseUrl: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          callback('请求目标链接不能为空');
        } else if (/https?:\/\/.*?/i.test(value.trim())) {
          callback();
        } else {
          callback('不是一个有效的链接');
        }
      },
    }]

  });
  const submitCreateBookStoreForm = () => {
    return new Promise<void>(async (reso, reje) => {
      if (!createBookStoreFormRef.value) {
        return reje();
      }
      await createBookStoreFormRef.value.validate((valid) => {
        if (!valid) {
          return reje();
        }
        createBookStoreTemplate();
        return reso();
      });
    });
  }
  const createBookStoreTemplate = () => {
    bookStoreTemplate.value = createTemplate({
      id: nanoid(),
      type: 'bookstore',
      group: createBookStoreForm.group.trim(),
      name: createBookStoreForm.name.trim(),
      version: createBookStoreForm.version.trim(),
      versionCode: createBookStoreForm.versionCode,
      pluginFileUrl: createBookStoreForm.pluginFileUrl.trim(),
      baseUrl: createBookStoreForm.baseUrl.trim(),
    });
    showCreateBookStore.value = false;
  }


  return {
    showCreateBookStore,
    createBookStoreForm,
    createBookStoreFormRef,
    submitCreateBookStoreForm,
    createBookStoreFormRules,
    bookStoreTemplate,
    createBookStoreTemplate
  }
}