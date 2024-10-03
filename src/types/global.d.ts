interface Window {
    ethereum?: any;
  }
  
  interface EthereumProvider {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  }