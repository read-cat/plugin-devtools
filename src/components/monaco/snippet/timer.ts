const snippet = `
interface TimerInterface {
  start: (...args: any[]) => void;
  stop: () => void;
  executor: (...args: any[]) => void;
  isRunning: () => boolean;
}
declare const Timer: {
  timeout: (executor: (...args: any[]) => void, ms?: number) => TimerInterface
  interval: (executor: (...args: any[]) => void, ms?: number) => TimerInterface
}
`;
export default snippet;