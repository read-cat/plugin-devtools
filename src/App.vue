<script setup lang="ts">
import Monaco from './components/monaco/index.vue';
import Options from './components/options/index.vue';
import { storeToRefs } from 'pinia';
import { useToolbar } from './hooks/toolbar';
import { useConfigStore } from './store/config';
import { onUnmounted } from 'vue';

const { currentFileName, isSave, platform } = storeToRefs(useConfigStore());
const { closeCurrentFile } = useConfigStore();
const onCreateTemplate = (t: string) => {
  monacoEditor.setValue(t);
}
const { isFullscreen } = useToolbar();

onUnmounted(() => {
  closeCurrentFile();
});
</script>

<template>
  <div id="main">
    <ElContainer style="height: 100%;">
      <ElAside id="console"></ElAside>
      <ElContainer class="container">
        <ElHeader :class="['header', 'app-drag', platform, isFullscreen ? 'fullscreen' : '']">
          <div class="left app-no-drag">
            <div v-if="platform === 'darwin'" class="window-controls-container app-no-drag"></div>
            <Options @create-template="onCreateTemplate" />
          </div>
          <div class="center app-no-drag">
            <p>
              <span v-if="!isSave">未保存 </span>
              <span>{{ currentFileName }}</span>
            </p>
          </div>
          <div class="right app-no-drag">
            <div  v-if="platform !== 'darwin'" class="window-controls-container app-no-drag"></div>
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
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      width: 100%;
      height: 30px;
      color: #D4D4D4;
      background-color: #3C3C3C;
      z-index: 999;

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

    .header:not(.darwin) {
      .left .window-controls-container {
        display: none;
      }

      &:not(.fullscreen) {
        .right .window-controls-container {
          width: 138px;
        }
      }

    }

    .header:has(.darwin) {
      &:not(.fullscreen) {
        .left .window-controls-container {
          width: 65px;
        }
      }

      .right .window-controls-container {
        display: none;
      }
    }

    .main {
      margin-top: 30px;
      padding: 0;

    }
  }
}
</style>
