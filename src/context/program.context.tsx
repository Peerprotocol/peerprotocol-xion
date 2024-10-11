"use client";

import { Cluster, PublicKey } from "@solana/web3.js";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCluster } from "@/hooks/use-cluster";
import { useAnchorProvider } from "@/hooks/use-anchor-provider";
import { getPda, PdaTag } from "@/lib/utils/get-pda";
import { txToast } from "@/lib/utils/toast";
import { BN } from "@coral-xyz/anchor";
import { getAta } from "@/lib/utils/getAta";
import {
  getPeerProtocolProgram,
  getPeerProtocolProgramId,
  getReadOnlyPeerProtocolProgram,
} from "../../solana-contracts/peer-protocol/src/peer-protocol-exports";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { xionChainInfo, xionContractAddress } from "@/lib/constants";
import Image from "next/image";
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

// READONLY PROGRAM
const readOnlyPeerProtocolProgram = getReadOnlyPeerProtocolProgram();

// TYPES
type ProtocolDataType = Awaited<
  ReturnType<typeof readOnlyPeerProtocolProgram.account.protocol.all>
>[0];
type UserProfileType = Awaited<
  ReturnType<typeof readOnlyPeerProtocolProgram.account.userProfile.fetch>
>;
interface ProgramContextType {
  account: string|null;
  userPubKey: PublicKey | null | undefined;
  userProfilePda: PublicKey;
  protocolData: ProtocolDataType | undefined;
  userData: UserProfileType | undefined;
  depositSol: UseMutationResult<any, unknown, { amount: number }, unknown>;
  withdrawSol: UseMutationResult<any, unknown, { amount: number }, unknown>;
  depositSpl: UseMutationResult<
    any,
    unknown,
    { amount: number; mint: PublicKey },
    unknown
  >;
  withdrawSpl: UseMutationResult<
    any,
    unknown,
    { amount: number; mint: PublicKey },
    unknown
  >;
  initUser: UseMutationResult<any, unknown, void, unknown>;
  userProfileSolBal: number | undefined;
}

const ProgramContext = createContext<ProgramContextType | null>(null);

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramContextProvider");
  }
  return context;
};

export const ProgramContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // HOOKS
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const { cluster } = useCluster();
  const anchorProvider = useAnchorProvider();
  const queryClient = useQueryClient();
  const [apiInstance, setApiInstance] = useState<SigningCosmWasmClient | null>();
  const [apiInstanceExec, setApiInstanceExec] = useState<SigningStargateClient | null>();
  const [account, setAccount] = useState<string|null>(null);

  useEffect(() => {
    const initApiInstance = async () => {
      const instance = await SigningCosmWasmClient.connectWithSigner(
      xionChainInfo.rpc,
      window.getOfflineSigner(xionChainInfo.chainId),
      {
        gasPrice: {
          amount: Decimal.fromUserInput("0.025", 6),
          denom: "uatom", 
        },
      }
    );
    
    setApiInstance(instance);
  }
  const initApiInstanceExec = async () => {
    const instance = await SigningStargateClient.connectWithSigner(
      xionChainInfo.rpc,
      window.getOfflineSigner(xionChainInfo.chainId),
      {
        gasPrice: {
          amount: Decimal.fromUserInput("0.025", 6), 
          denom: "uatom", 
        },
        registry: new Registry([
          ...defaultRegistryTypes,
          ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract] as any,
        ]),
      }
    );
    setApiInstanceExec(instance);
  }
    initApiInstance();
    initApiInstanceExec();
    connectToCosmos().then(accounts => {
      if(!accounts)return;
      const address = (accounts as any)[0].address;
      setAccount(address);
    })
  }, []);

  

   const getContract = () =>{
    if(!apiInstance) {
      throw new Error("apiInstance not initialized");
    }
    if(!apiInstanceExec) {
      throw new Error("apiInstanceExec not initialized");
    }
  
    return {
      queryContractSmart: apiInstance.queryContractSmart.bind(apiInstance),
      execute: async (
        senderAddress: string,
        contractAddress: string,
        msg: Record<string, unknown>,
        fee: StdFee | "auto" | number,
        memo?: string,
        funds?: readonly Coin[]
      ): Promise<DeliverTxResponse> => {
       
        const mutableFunds: Coin[] = funds ? [...funds] : [];
        const executeMsg = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: MsgExecuteContract.fromPartial({
            sender: senderAddress,
            contract: contractAddress,
            msg: toUtf8(JSON.stringify(msg)),
            funds: mutableFunds,
          }),
        };
        const result = await apiInstanceExec.signAndBroadcast(
          senderAddress,
          [executeMsg],
          fee,
          memo
        );
  
        if (result.code !== 0) {
          throw new Error(`Failed to execute contract: ${result.code}`);
        }
  
        return result;
      },
    };
  }

  // PROGRAM SETUP
  const programId = useMemo(
    () => getPeerProtocolProgramId(cluster?.network as Cluster),
    [cluster]
  );
  const program = getPeerProtocolProgram(anchorProvider);

  // USER SETUP
  const userPubKey = wallet?.adapter.publicKey;
  const userProfilePda = getPda(PdaTag.USER_PROFILE_TAG, userPubKey, programId);

  // QUERIES
  const userProfileQuery = useQuery({
    queryKey: ["peer-protocol", "user-init", { cluster, userPubKey }],
    queryFn: () => program.account.userProfile.fetch(userProfilePda),
  });

  const protocolQuery = useQuery({
    queryKey: ["peer-protocol", "protocol", { cluster, userPubKey }],
    queryFn: () => program.account.protocol.all(),
  });

  const balanceQuery = useQuery({
    queryKey: ["peer-protocol", "balance", { cluster, userPubKey }],
    queryFn: () => program.provider.connection.getBalance(userProfilePda),
  });

  // QUERY DATA
  const protocolData = protocolQuery.data?.[0];
  const userData = userProfileQuery.data;

  // MUTATIONS
  const initUser = useMutation({
    mutationKey: ["peer-protocol", "initialize-user", {  }],
    mutationFn: async () => {
      if (!apiInstance) return;
      if (!apiInstanceExec) return;
      if(!account) return;

      const contract =  getContract();
      return await contract.execute(
        account,
        xionContractAddress,
        {
          initialize_user: {
          },
        },
        "auto"
      );
    },
    onSuccess: (signature) => {
      queryClient.invalidateQueries({
        queryKey: ["peer-protocol", "user-init"],
      });
      txToast.success("User account initialized successfully!");
    },
    onError: (error) => {
      console.log(error)
      txToast.error("Error initializing user account!");
    },
  });

  const depositSol = useMutation({
    mutationKey: ["peer-protocol", "deposit-sol", { cluster, userPubKey }],
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!userPubKey) return;
      if (!protocolData) return;
      return await program.methods
        .depositSol(new BN(amount))
        .accounts({
          authority: userPubKey,
          protocol: protocolData.publicKey,
          // userProfile: userProfilePda,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      queryClient.invalidateQueries({ queryKey: ["peer-protocol", "balance"] });
      txToast.success("deposit successful!");
    },
    onError: (error) => {
      txToast.error("Error depositing funds!");
    },
  });

  const withdrawSol = useMutation({
    mutationKey: ["peer-protocol", "withdraw-sol", { cluster, userPubKey }],
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!userPubKey) return;
      if (!protocolData) return;
      return await program.methods
        .withdrawSol(new BN(amount))
        .accounts({
          authority: userPubKey,
          protocol: protocolData.publicKey,
          // userProfile: userProfilePda,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      queryClient.invalidateQueries({ queryKey: ["peer-protocol", "balance"] });
      txToast.success("withdraw successful!");
    },
    onError: (error) => {
      txToast.error("Error withdrawing funds!");
    },
  });

  const depositSpl = useMutation({
    mutationKey: ["peer-protocol", "deposit-spl", { cluster }, userPubKey],
    mutationFn: async ({
      amount,
      mint,
    }: {
      amount: number;
      mint: PublicKey;
    }) => {
      if (!userPubKey) return;
      if (!protocolData) return;
      return await program.methods
        .depositSpl(new BN(amount))
        .accounts({
          authority: userPubKey,
          protocol: protocolData.publicKey,
          // userProfile: userProfilePda,
          mint,
          // userProfileAta: getAta(userProfilePda, mint),
          userAta: getAta(userPubKey, mint),
        })
        .rpc();
    },
    onSuccess: (signature) => {
      queryClient.invalidateQueries({
        queryKey: ["peer-protocol", "token-balance"],
      });
      txToast.success("deposit successful!");
    },
    onError: (error) => {
      txToast.error("Error depositing funds!");
    },
  });

  const withdrawSpl = useMutation({
    mutationKey: ["peer-protocol", "withdraw-spl", { cluster }, userPubKey],
    mutationFn: async ({
      amount,
      mint,
    }: {
      amount: number;
      mint: PublicKey;
    }) => {
      if (!userPubKey) return;
      if (!protocolData) return;

      const userProfileAta = getAta(userProfilePda, mint);
      const userAta = getAta(userPubKey, mint);

      return await program.methods
        .withdrawSpl(new BN(amount))
        .accounts({
          authority: userPubKey,
          protocol: protocolData.publicKey,
          // userProfile: userProfilePda,
          mint,
          userProfileAta,
          userAta,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      queryClient.invalidateQueries({
        queryKey: ["peer-protocol", "token-balance"],
      });
      txToast.success("withdraw successful!");
    },
    onError: (error) => {
      txToast.error("Error withdrawing funds!");
    },
  });
  return (
    <ProgramContext.Provider
      value={{
        userPubKey,
        protocolData,
        userData,
        depositSol,
        initUser,
        withdrawSol,
        userProfileSolBal: balanceQuery.data,
        depositSpl,
        withdrawSpl,
        userProfilePda,
        account,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const connectToCosmos = async () =>{
  try {
    if (!window.getOfflineSigner || !window.keplr) {
      throw new Error("Keplr extension not installed");
    }
    const keplr = window.keplr;

    await keplr.experimentalSuggestChain(xionChainInfo);

    await keplr.enable(xionChainInfo.chainId);

    const offlineSigner = window.getOfflineSigner(xionChainInfo.chainId);

    const accounts = await offlineSigner.getAccounts();

    return accounts;
   
  } catch (error) {
    console.error("Failed to connect to Wallet:", error);
    throw error;
  }
}