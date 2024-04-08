import { defineStore } from 'pinia';
import { isNull } from '../is';
import { Event } from '../event';
export const useConfigStore = defineStore('Config', {
  state() {
    return {
      _event: null as null | Event,
      currentFileName: null as string | null,
      currentWritable: null as FileSystemWritableFileStream | null,
      saveCode: null as string | null,
      isSave: false,
      pluginType: -1
    }
  },
  getters: {
    event(): Event {
      if (isNull(this._event)) {
        throw new Error('event is null');
      }
      return this._event;
    }
  },
  actions: {
    async closeCurrentFile() {
      if (!this.currentWritable) {
        return;
      }
      await this.currentWritable.close();
      this.currentWritable = null;
    }
  }
})