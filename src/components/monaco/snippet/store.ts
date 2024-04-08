const snippet = `
declare interface Store {
  setStoreValue: (key: string, value: any) => Promise<void>;
  getStoreValue: (key: string) => Promise<void>;
  removeStoreValue: (key: string) => Promise<void>;
}
`;
export default snippet;