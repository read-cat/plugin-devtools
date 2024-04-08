import { ElMessage, MessageOptionsWithType } from 'element-plus';
import { isString, isUndefined } from '../is';

type MessageType = 'error' | 'success' | 'warning' | 'info';
export const useMessage = () => {
  const offset = window.screen.height / 2 + 100;
  const grouping = true;

  const showMessage = (options: MessageOptionsWithType | string, type: MessageType) => {
    let opts: MessageOptionsWithType = {
      offset,
      grouping
    }
    if (isString(options)) {
      opts.message = options;
    } else if (isUndefined(options?.message)) {
      opts.message = String(options);
    } else {
      opts = {
        ...opts,
        ...options,
      }
    }
    return ElMessage({
      type,
      ...opts
    });
  }
  const error = (options: MessageOptionsWithType | string) => {
    return showMessage(options, 'error');
  }
  const success = (options: MessageOptionsWithType | string) => {
    return showMessage(options, 'success');
  }
  const warning = (options: MessageOptionsWithType | string) => {
    return showMessage(options, 'warning');
  }
  const info = (options: MessageOptionsWithType | string) => {
    return showMessage(options, 'info');
  }

  return {
    success,
    error,
    warning,
    info
  }
}