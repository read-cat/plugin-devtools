
declare global {
  interface Console {
    log: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    verbose: (...args: any[]) => void;
  }
  var console: Console;
}
interface Console {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  verbose: (...args: any[]) => void;
}
declare var console: Console;