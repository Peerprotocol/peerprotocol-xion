// global.d.ts or window.d.ts
import type {
  ChainInfoWithoutEndpoints,
  Keplr as KeplrType,
  Window as KeplrWindow,
} from "@keplr-wallet/types";

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  // Add more types as needed
}

interface Solana {
  isPhantom?: boolean;
  connect: () => Promise<any>;
  disconnect: () => any;
  publicKey: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    keplr?: Keplr & {
      ethereum: any;
      getChainInfoWithoutEndpoints: (
        chainId: string
      ) => Promise<ChainInfoWithoutEndpoints>;
    };
    ethereum?: Ethereum;
    solana?: Solana;
    getOfflineSigner: any;
  }
}
