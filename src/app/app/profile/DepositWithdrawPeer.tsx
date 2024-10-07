import Image from "next/image";
import React, { useState } from "react";
import Settings from "../../../../public/images/Set.svg";
import Logo from "../../../../public/images/LogoBlack.svg";
import { useProgram } from "@/context/program.context";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Token, whitelistedTokens } from "@/lib/utils/tokens.data";
import { useQuery } from "@tanstack/react-query";
import { getAccount, getMint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { getAta } from "@/lib/utils/getAta";

type MarketOptions = "deposit" | "withdraw";
const marketOptions: MarketOptions[] = ["deposit", "withdraw"];

const DepositWithdrawPeer = () => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<MarketOptions>("deposit");
  const [selectedToken, setSelectedToken] = useState<Token>(
    whitelistedTokens.USDC
  );
  const {
    withdrawSol,
    depositSol,
    depositSpl,
    withdrawSpl,
    userProfileSolBal = 0,
    userProfilePda,
  } = useProgram();
  const { connection } = useConnection();
  const { data: tokenBalance = 0 } = useQuery({
    queryKey: ["peer-protocol", "token-balance", selectedToken],
    queryFn: async () => {
      if (selectedToken.isNative) return 0;

      const ata = getAta(userProfilePda, selectedToken.mintAddress);
      const [info, mint] = await Promise.all([
        getAccount(connection, ata),
        getMint(connection, selectedToken.mintAddress),
      ]);
      const amount = Number(info.amount);
      const balance = amount / 10 ** mint.decimals;
      return balance;
    },
  });

  const handleSelectChange = (option: MarketOptions) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(whitelistedTokens[e.target.value]);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="border border-[#0000001A] bg-white p-6 rounded-[1rem] md:flex-grow flex-col relative text-black w-full md:h-[fit-content]">
      <div className="pb-4 flex justify-end">
        <div
          className="flex items-center border py-2 px-4 rounded-3xl border-black cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute mt-10 w-[7rem] md:w-[8.5rem] rounded-md shadow-lg bg-white">
            <div className="py-1">
              {marketOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectChange(option)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    option === selectedOption ? "bg-gray-100" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <hr className="border-t pb-4" />
      <div className="bg-smoke-white py-2 px-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <p>Your deposit</p>
          <div className="">
            <p className="text-xs text-right">Priority fee</p>
            <div className="flex items-center border px-3 py-1 rounded-3xl bg-[#0000000D]">
              <p className="text-xs">Minimum</p>
              <Image
                src={Settings}
                height={15}
                width={15}
                alt="settings-icon"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          {/* <div className="flex items-center justify-center bg-[#0000000D] py-2 px-4 rounded-xl">
            <div className="flex gap-3 items-center">
              <Image src={USDC} width={25} height={25} alt="USDC-Image" />
              <p className="mr-2">USDC</p>
            </div>
            <div className="flex-shrink-0 pl-6">
              <Image src={Drop} height={15} width={15} alt="dropicon" />
            </div>
          </div> */}

          <div className="flex items-center justify-center bg-[#0000000D] py-2 px-4 rounded-xl">
            <select
              className="bg-transparent text-black outline-none"
              value={selectedToken.symbol}
              onChange={handleTokenChange}
            >
              <option value="USDC">USDC</option>
              <option value="SOL">SOL</option>
            </select>
            <div className="flex-shrink-0 pl-6">
              <Image
                src={selectedToken.image}
                height={15}
                width={15}
                alt="dropicon"
              />
            </div>
          </div>

          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="text-right text-[1.4rem] font-bold bg-transparent outline-none w-[60%] md:w-auto"
          />
        </div>
        <p className="text-xs">
          Available:{" "}
          {selectedToken === whitelistedTokens["SOL"]
            ? (userProfileSolBal / LAMPORTS_PER_SOL).toFixed(4)
            : tokenBalance.toFixed(4)}
        </p>
        <div className="flex gap-2 justify-end">
          {["25%", "50%", "75%", "100%"].map((percent, index) => (
            <button
              key={index}
              className="bg-[#0000000D] text-xs px-2 py-1 rounded-md"
            >
              {percent}
            </button>
          ))}
        </div>
      </div>
      <button
        className="bg-black text-white rounded-lg w-full py-3 mt-4 capitalize"
        onClick={() => {
          switch (selectedOption) {
            case "deposit":
              selectedToken.isNative
                ? depositSol.mutate({
                    amount: +amount * LAMPORTS_PER_SOL,
                  })
                : depositSpl.mutate({
                    amount: +amount * LAMPORTS_PER_SOL,
                    mint: selectedToken.mintAddress,
                  });
              break;
            case "withdraw":
              selectedToken.isNative
                ? withdrawSol.mutate({
                    amount: +amount * LAMPORTS_PER_SOL,
                  })
                : withdrawSpl.mutate({
                    amount: +amount * LAMPORTS_PER_SOL,
                    mint: selectedToken.mintAddress,
                  });
              break;
          }
        }}
      >
        {selectedOption}
      </button>
      <div className="flex justify-center gap-2 mt-4">
        <p className="text-xs opacity-50">Powered by Peer Protocol</p>
        <Image src={Logo} height={15} width={15} alt="logo-icon" />
      </div>
    </div>
  );
};

export default DepositWithdrawPeer;
