"use client";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import "@burnt-labs/ui/dist/index.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { useMutation } from "@tanstack/react-query";
import { deployedContracts } from "@/constants/contracts";

export const useDeposit = () => {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  //   const blockExplorerUrl = `https://explorer.burnt.com/xion-testnet-1/tx/${executeResult?.transactionHash}`;

  const depositMutation = useMutation({
    mutationKey: ["deposit"],
    mutationFn: async (amount: string): Promise<ExecuteResult | undefined> => {
      const msg = { deposit_native: {} };

      return await client?.execute(
        account.bech32Address,
        deployedContracts[0],
        msg,
        "auto",
        "",
        [{ amount, denom: "uxion" }]
      );
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return { depositMutation };
};

// type ExecuteResultOrUndefined = ExecuteResult | undefined;
// export default function Page() {
//   // Abstraxion hooks
//   const { data: account } = useAbstraxionAccount();
//   const { client } = useAbstraxionSigningClient();

//   // General state hooks
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [executeResult, setExecuteResult] =
//     useState<ExecuteResultOrUndefined>(undefined);

//     function getTimestampInSeconds(date: Date | null) {
//     if (!date) return 0;
//     const d = new Date(date);
//     return Math.floor(d.getTime() / 1000);
// }

// const now = new Date();
// now.setSeconds(now.getSeconds() + 15);
//   const oneYearFromNow = new Date();
//   oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

//   async function claimSeat() {
//     setLoading(true);
//     const msg = {
//       sales: {
//         claim_item: {
//           token_id: String(getTimestampInSeconds(now)),
//           owner: account.bech32Address,
//           token_uri: "",
//           extension: {},
//         },
//     },
//     };

//     try {
//       const claimRes = await client?.execute(
//         account.bech32Address,
//         seatContractAddress,
//         msg,
//         {
//           amount: [{ amount: "0", denom: "uxion" }],
//           gas: "500000",
//         },
//         "", // memo
//         []
//       );

//       setExecuteResult(claimRes);
//     } catch (error) {
//         // eslint-disable-next-line no-console -- No UI exists yet to display errors
//         console.log(error);
//     } finally {
//         setLoading(false);
//     }
// }
// }
