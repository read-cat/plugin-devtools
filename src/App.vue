<script setup lang="ts">
import Monaco from './components/monaco/index.vue';
import IconClose from './assets/svg/icon-close.svg';
import IconMinimize from './assets/svg/icon-minimize.svg';
import IconMaximize from './assets/svg/icon-maximize.svg';
import IconMaximizeRestore from './assets/svg/icon-maximize-restore.svg';
import Options from './components/options/index.vue';
import { storeToRefs } from 'pinia';
import { useToolbar } from './hooks/toolbar';
import { useConfigStore } from './store/config';
import { onUnmounted } from 'vue';

const { currentFileName, isSave } = storeToRefs(useConfigStore());
const { closeCurrentFile } = useConfigStore();
const onCreateTemplate = (t: string) => {
  monacoEditor.setValue(t);
}
const { isMaximize, setMaximizeOrRestore, setMinimizable, closeWindow } = useToolbar();

onUnmounted(() => {
  closeCurrentFile();
});
</script>

<template>
  <div id="main">
    <ElContainer style="height: 100%;">
      <ElAside id="console"></ElAside>
      <ElContainer class="container">
        <ElHeader class="header app-drag">
          <div class="left app-no-drag">
            <Options @create-template="onCreateTemplate" />
          </div>
          <div class="center app-no-drag">
            <p>
              <span v-if="!isSave">未保存  </span>
              <span>{{ currentFileName }}</span>
            </p>
          </div>
          <div class="right app-no-drag">
            <button class="rc-button" @click="setMinimizable">
              <IconMinimize />
            </button>
            <button class="rc-button" @click="setMaximizeOrRestore">
              <IconMaximize v-if="!isMaximize" />
              <IconMaximizeRestore v-else />
            </button>
            <button class="rc-button" @click="closeWindow">
              <IconClose />
            </button>
          </div>
        </ElHeader>
        <ElMain class="main">
          <Monaco />
        </ElMain>
      </ElContainer>
    </ElContainer>
  </div>
</template>
<style>
.el-dropdown-menu__item i {
  margin-right: 10px;
}
</style>
<style scoped lang="scss">
#main {
  height: 100vh;
  background-color: #1E1E1E;

  .container {
    height: 100%;

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      height: 30px;
      color: #D4D4D4;
      background-color: #3C3C3C;

      .center {
        p {
          font-size: 13px;

        }
      }

      .right {
        display: flex;

        button {
          margin-right: 5px;
          width: 20px;
          height: 20px;
          border-radius: 7px;
          outline: none;

          &:active * {
            transform: scale(0.8);
          }

          &:last-child:hover {
            color: #F56C6C;
          }
        }
      }
    }

    .main {
      padding: 0;

    }
  }
}
</style>
