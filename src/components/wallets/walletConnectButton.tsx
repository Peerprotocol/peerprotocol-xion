import { SolanaWalletButton } from "./solanaWalletButton";
import { XionWallet } from "./xionWalletButton";

export const WalletConnectButton = ({ network }: { network: string }) => {
  return <XionWallet />;
};
