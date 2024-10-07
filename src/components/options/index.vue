<script setup lang="ts">
import { useCreateBookSource } from './hooks/create-booksource';
import { useFile } from './hooks/file';
import { useDebugBookSource } from './hooks/debug/booksource';
import { ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useConfigStore } from '../../store/config';
import { useCompile } from './hooks/compile';
import { useMessage } from '../../hooks/message';
import { useCreateTTSEngine } from './hooks/create-tts-engine';
import { useDebugTTSEngine } from './hooks/debug/ttsengine';
import { useCreateBookStore } from './hooks/create-bookstore';
import { useDebugBookStore } from './hooks/debug/bookstore';

const emits = defineEmits<{
  createTemplate: [template: string]
}>();

const {
  showCreateBookSource,
  createBookSourceForm,
  createBookSourceFormRef,
  submitCreateBookSourceForm,
  createBookSourceFormRules,
  bookSourceTemplate,
} = useCreateBookSource();
const {
  showCreateBookStore,
  createBookStoreForm,
  createBookStoreFormRef,
  submitCreateBookStoreForm,
  createBookStoreFormRules,
  bookStoreTemplate,
} = useCreateBookStore();
const {
  showCreateTTSEngine,
  createTTSEngineForm,
  createTTSEngineFormRef,
  submitCreateTTSEngineForm,
  createTTSEngineFormRules,
  ttsEngineTemplate,
} = useCreateTTSEngine();

const {
  openFile,
  saveAs,
  save,
  closeFile
} = useFile();

const {
  runSearch,
  runGetDetail,
  runGetTextContent,
  showSetSearchKeyWindow,
  showSetDetailPageUrlWindow,
  showSetChapterWindow
} = useDebugBookSource();

const {
  showSetTextWindow,
  showSetVoiceWindow,
  runTransform,
  runGetVoiceList
} = useDebugTTSEngine();

const {
  runBookStore
} = useDebugBookStore();

const { compile } = useCompile();

const { currentFileName, pluginType, event, bookStoreConfigKeys } = storeToRefs(useConfigStore());
const { closeCurrentFile } = useConfigStore();
const message = useMessage();
const submitBookSourceTemplate = () => {
  submitCreateBookSourceForm().then(() => {
    ElMessageBox.confirm('是否创建模板, 创建后会覆盖当前内容', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '创建'
    }).then(() => {
      emits('createTemplate', bookSourceTemplate.value);
      currentFileName.value = null;
      closeCurrentFile().catch(e => {
        message.error(e.message);
      });
    }).catch(() => { });
  }).catch(() => { });
}
const submitBookStoreTemplate = () => {
  submitCreateBookStoreForm().then(() => {
    ElMessageBox.confirm('是否创建模板, 创建后会覆盖当前内容', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '创建'
    }).then(() => {
      emits('createTemplate', bookStoreTemplate.value);
      currentFileName.value = null;
      closeCurrentFile().catch(e => {
        message.error(e.message);
      });
    }).catch(() => { });
  }).catch(() => { });
}
const submitTTSEngineTemplate = () => {
  submitCreateTTSEngineForm().then(() => {
    ElMessageBox.confirm('是否创建模板, 创建后会覆盖当前内容', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '创建'
    }).then(() => {
      emits('createTemplate', ttsEngineTemplate.value);
      currentFileName.value = null;
      closeCurrentFile().catch(e => {
        message.error(e.message);
      });
    }).catch(() => { });
  }).catch(() => { });
}

const connect = () => {
  event.value.connect();
}
</script>
<script lang="ts">
export default {
  name: 'Options'
}
</script>

<template>
  <div class="container">
    <ul>
      <ElDropdown size="small">
        <li>文件</li>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="openFile">
              打开文件
            </ElDropdownItem>
            <ElDropdownItem @click="save">
              保存
            </ElDropdownItem>
            <ElDropdownItem @click="saveAs">
              另存为
            </ElDropdownItem>
            <ElDropdownItem @click="closeFile">
              关闭文件
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown size="small">
        <li>模板</li>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="showCreateBookSource = true">
              生成书源模板
            </ElDropdownItem>
            <ElDropdownItem @click="showCreateBookStore = true">
              生成书城模板
            </ElDropdownItem>
            <ElDropdownItem @click="showCreateTTSEngine = true">
              生成TTS引擎模板
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown size="small">
        <li>调试</li>
        <template #dropdown>
          <ElDropdownMenu v-if="pluginType === 0">
            <ElDropdownItem @click="runSearch">
              执行 search
            </ElDropdownItem>
            <ElDropdownItem @click="runGetDetail">
              执行 getDetail
            </ElDropdownItem>
            <ElDropdownItem @click="runGetTextContent">
              执行 getTextContent
            </ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else-if="pluginType === 1">
            <ElDropdownItem v-for="key of bookStoreConfigKeys" :key="key" @click="runBookStore(key)">{{ `执行 ${key}` }}</ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else-if="pluginType === 2">
            <ElDropdownItem @click="runTransform">
              执行 transform
            </ElDropdownItem>
            <ElDropdownItem @click="runGetVoiceList">
              执行 getVoiceList
            </ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else>
            <ElDropdownItem>未识别到插件类型</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown size="small">
        <li>设置</li>
        <template #dropdown>
          <ElDropdownMenu v-if="pluginType === 0">
            <ElDropdownItem @click="showSetSearchKeyWindow">
              SearchKey
            </ElDropdownItem>
            <ElDropdownItem @click="showSetDetailPageUrlWindow">
              DetailPageUrl
            </ElDropdownItem>
            <ElDropdownItem @click="showSetChapterWindow">
              Chapter
            </ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else-if="pluginType === 1">
            <ElDropdownItem>无</ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else-if="pluginType === 2">
            <ElDropdownItem @click="showSetVoiceWindow">
              Voice
            </ElDropdownItem>
            <ElDropdownItem @click="showSetTextWindow">
              Text
            </ElDropdownItem>
          </ElDropdownMenu>
          <ElDropdownMenu v-else>
            <ElDropdownItem>未识别到插件类型</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown size="small">
        <li>编译</li>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="compile(false)">
              Release
            </ElDropdownItem>
            <ElDropdownItem @click="compile(true)">
              Debug
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <li @click="connect">连接</li>
    </ul>
    <ElDialog v-model="showCreateBookSource" title="创建书源模板" width="500">
      <ElForm ref="createBookSourceFormRef" :model="createBookSourceForm" :rules="createBookSourceFormRules">
        <ElFormItem label="分组" :label-width="150" prop="group">
          <ElInput v-model="createBookSourceForm.group" placeholder="插件分组" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="名称" required :label-width="150" prop="name">
          <ElInput v-model="createBookSourceForm.name" placeholder="插件名称" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号" required :label-width="150" prop="version">
          <ElInput v-model="createBookSourceForm.version" placeholder="插件版本号, 用于显示" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号代码" required :label-width="150" prop="versionCode">
          <ElInput v-model.number="createBookSourceForm.versionCode" type="text" placeholder="插件版本代码, 用于插件版本比较"
            autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="请求目标链接" required :label-width="150" prop="baseUrl">
          <ElInput v-model="createBookSourceForm.baseUrl" placeholder="插件请求目标链接" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="链接" :label-width="150" prop="pluginFileUrl">
          <ElInput v-model="createBookSourceForm.pluginFileUrl" placeholder="插件文件链接, 用于插件更新" autocomplete="off" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="showCreateBookSource = false">取消</ElButton>
        <ElButton type="primary" @click="submitBookSourceTemplate">创建</ElButton>
      </template>
    </ElDialog>
    <ElDialog v-model="showCreateBookStore" title="创建书城模板" width="500">
      <ElForm ref="createBookStoreFormRef" :model="createBookStoreForm" :rules="createBookStoreFormRules">
        <ElFormItem label="分组" :label-width="150" prop="group">
          <ElInput v-model="createBookStoreForm.group" placeholder="插件分组" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="名称" required :label-width="150" prop="name">
          <ElInput v-model="createBookStoreForm.name" placeholder="插件名称" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号" required :label-width="150" prop="version">
          <ElInput v-model="createBookStoreForm.version" placeholder="插件版本号, 用于显示" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号代码" required :label-width="150" prop="versionCode">
          <ElInput v-model.number="createBookStoreForm.versionCode" type="text" placeholder="插件版本代码, 用于插件版本比较"
            autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="请求目标链接" required :label-width="150" prop="baseUrl">
          <ElInput v-model="createBookStoreForm.baseUrl" placeholder="插件请求目标链接" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="链接" :label-width="150" prop="pluginFileUrl">
          <ElInput v-model="createBookStoreForm.pluginFileUrl" placeholder="插件文件链接, 用于插件更新" autocomplete="off" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="showCreateBookStore = false">取消</ElButton>
        <ElButton type="primary" @click="submitBookStoreTemplate">创建</ElButton>
      </template>
    </ElDialog>
    <ElDialog v-model="showCreateTTSEngine" title="创建TTS引擎模板" width="500">
      <ElForm ref="createTTSEngineFormRef" :model="createTTSEngineForm" :rules="createTTSEngineFormRules">
        <ElFormItem label="分组" :label-width="150" prop="group">
          <ElInput v-model="createTTSEngineForm.group" placeholder="插件分组" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="名称" required :label-width="150" prop="name">
          <ElInput v-model="createTTSEngineForm.name" placeholder="插件名称" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号" required :label-width="150" prop="version">
          <ElInput v-model="createTTSEngineForm.version" placeholder="插件版本号, 用于显示" autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="版本号代码" required :label-width="150" prop="versionCode">
          <ElInput v-model.number="createTTSEngineForm.versionCode" type="text" placeholder="插件版本代码, 用于插件版本比较"
            autocomplete="off" />
        </ElFormItem>
        <ElFormItem label="链接" :label-width="150" prop="pluginFileUrl">
          <ElInput v-model="createTTSEngineForm.pluginFileUrl" placeholder="插件文件链接, 用于插件更新" autocomplete="off" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="showCreateTTSEngine = false">取消</ElButton>
        <ElButton type="primary" @click="submitTTSEngineTemplate">创建</ElButton>
      </template>
    </ElDialog>

  </div>
</template>

<style scoped lang="scss">
.container {
  ul {
    display: flex;
    flex-direction: row;

    :deep(.el-dropdown) {
      margin-right: 5px;

    }

    li {

      padding: 4px 10px;
      color: #D4D4D4;
      font-size: 12px;
      border-radius: 5px;
      transition: background-color 0.5s ease;
      outline: none;
      line-height: 100%;
      &:hover {
        background-color: rgba(127, 127, 127, 0.5);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>