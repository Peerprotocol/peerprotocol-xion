import { xionChainInfo } from "@/lib/constants";
import Image from "next/image";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  Coin,
  DeliverTxResponse,
  SigningStargateClient,
  StdFee,
} from "@cosmjs/stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { useMemo, useState } from "react";
import { connectToCosmos } from "@/context/program.context";

export const XionWallet = () => {

  const [account, setAccount] = useState<[]>([]);

  const content = useMemo(() => {
    if(account.length > 0){
     const address = (account as any)[0].address;
      return address.slice(0, 4) + ".." + address.slice(-4);
    }else {
      return "Connect Wallet";
    }
  }, [account]);

 

 
  return (
    <div className="relative">
      <button
        className="bg-[hsla(0,0%,0%,1)] flex items-center gap-2 py-2 rounded-3xl px-3"
        onClick={async () => {
         const accounts = await connectToCosmos();
          setAccount(accounts);
        }}
      >
        <Image
          src="/images/walletconnect.svg"
          height={20}
          width={20}
          alt="connect wallet"
        />
        <p className="text-sm">{content}</p>
      </button>
    </div>
  );
};