import { useMessage } from '../../../../hooks/message';
import { useTypeScript } from '../../../../hooks/typescript';

const message = useMessage();
const { compile } = useTypeScript();

export const run = (callback: (jscode: string) => void) => {
  compile(monacoEditor.getValue()).then(jscode => {
    callback(jscode);
  }).catch(e => {
    message.error('编译错误');
    console.error('编译错误:', e);
  });
}