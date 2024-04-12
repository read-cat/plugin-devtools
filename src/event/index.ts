import { useMessage } from '../hooks/message';
import { isUndefined, isNull } from '../is';
import { PluginDevtoolsEventCode } from './event-code';

export class EventHandler {
  public ws: WebSocket | null = null;
  public events;
  constructor() {
    this.events = new Map<string, (error?: string, ...args: any[]) => void>();
    this.connect();
  }

  public connect() {
    const message = useMessage();
    if (!isNull(this.ws) && this.ws.readyState === this.ws.OPEN) {
      message.success('已连接');
      return;
    }
    this.ws = new WebSocket(`ws://${location.host}`);
    // this.ws = new WebSocket(`ws://127.0.0.1:6028`);
    this.ws.onmessage = e => {
      const { code, error, args } = JSON.parse(e.data);
      const call = this.events.get(code);
      if (!isUndefined(call)) {
        call(error, ...args);
      }
    }
    this.ws.onopen = () => {
      this.send(PluginDevtoolsEventCode.TEST, 1, '2', true);
      message.success('已连接');
    }
    this.ws.onclose = () => {
      console.warn('已断开连接');
    }
    this.ws.onerror = () => {
      message.error('连接失败');
      console.error('连接失败');
      this.ws = null;
    }
  }

  public send(code: string, ...args: any[]) {
    const message = useMessage();
    if (isNull(this.ws) || this.ws.readyState !== this.ws.OPEN) {
      message.error('与ReadCat断开连接');
      return;
    }
    this.ws.send(JSON.stringify({
      code,
      args
    }));
  }
  public on(code: string, listener: (error?: string, ...args: any[]) => void) {
    this.events.set(code, listener);
  }
}