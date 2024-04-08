import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { isNumber } from '../../../is';
import { createTemplate } from '../../../template';
import { nanoid } from 'nanoid';

export const useCreateBookSource = () => {
  const showCreateBookSource = ref(false);
  const bookSourceTemplate = ref('');
  const createBookSourceFormRef = ref<FormInstance>();
  const createBookSourceForm = reactive({
    group: '',
    name: '',
    version: '',
    versionCode: 0,
    pluginFileUrl: '',
    baseUrl: '',
  });

  const createBookSourceFormRules = reactive<FormRules<typeof createBookSourceForm>>({
    group: [{
      trigger: 'blur',
      validator(_, value, callback) {
        if (value.trim() === '') {
          createBookSourceForm.group = '默认';
        } else {
          createBookSourceForm.group = value.trim();
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
  const submitCreateBookSourceForm = () => {
    return new Promise<void>(async (reso, reje) => {
      if (!createBookSourceFormRef.value) {
        return reje();
      }
      await createBookSourceFormRef.value.validate((valid) => {
        if (!valid) {
          return reje();
        }
        createBookSourceTemplate();
        return reso();
      });
    });
  }
  const createBookSourceTemplate = () => {
    bookSourceTemplate.value = createTemplate({
      id: nanoid(),
      type: 'booksource',
      group: createBookSourceForm.group.trim(),
      name: createBookSourceForm.name.trim(),
      version: createBookSourceForm.version.trim(),
      versionCode: createBookSourceForm.versionCode,
      pluginFileUrl: createBookSourceForm.pluginFileUrl.trim(),
      baseUrl: createBookSourceForm.baseUrl.trim(),
    });
    showCreateBookSource.value = false;
  }


  return {
    showCreateBookSource,
    createBookSourceForm,
    createBookSourceFormRef,
    submitCreateBookSourceForm,
    createBookSourceFormRules,
    bookSourceTemplate,
    createBookSourceTemplate
  }
}