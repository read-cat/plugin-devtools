import { isUndefined } from "../is";
import { PluginDevtoolsEventCode } from "./event-code";

export type Event = {
  send(code: string, ...args: any[]): void;
  on(code: string, listener: (error?: string, ...args: any[]) => void): void;
}
export class EventHandler {
  private ws: WebSocket;
  private events;
  constructor() {
    this.events = new Map<string, (error?: string, ...args: any[]) => void>();
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
    }
    this.ws.onerror = () => {
      console.error('连接失败');
    }
    
  }

  public send(code: string, ...args: any[]) {
    this.ws.send(JSON.stringify({
      code,
      args
    }));
  }
  public on(code: string, listener: (error?: string, ...args: any[]) => void) {
    this.events.set(code, listener);
  }
}