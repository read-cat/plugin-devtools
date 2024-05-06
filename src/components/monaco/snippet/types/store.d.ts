declare interface Store {
  setStoreValue: (key: string, value: any) => Promise<void>;
  getStoreValue: <R = any>(key: string) => Promise<R | null>;
  removeStoreValue: (key: string) => Promise<void>;
}