import Image from "next/image";
import Dropdown from "./dropdown";
import { useEffect, useState } from "react";
import { getKeplrFromWindow } from "@/util/getKeplrFromWindow";
import { xionInfo } from "@/constants/coins";
import { ellipsify } from "@/util/ellipsify";
const Nav = () => {
  const [address, setAddress] = useState<string>("");
  const getKeyFromKeplr = async () => {
    try {
      const key = await window.keplr?.getKey(xionInfo.chainId);

      console.log(key);
      if (key) {
        setAddress(key.bech32Address);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const init = async () => {
    if (!!address) return;
    const keplr = await getKeplrFromWindow();

    if (keplr) {
      try {
        await keplr.experimentalSuggestChain(xionInfo);
        await getKeyFromKeplr();
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    }
  };
  return (
    <nav className="flex justify-end items-center p-4 w-full gap-3">
      <Image
        src="/images/Notification.svg"
        height={30}
        width={30}
        alt="Notification icon"
        className="ml-4"
      />
      <Dropdown />
      <div
        className="bg-[rgba(0,0,0,0.8)] flex items-center gap-2 py-2 rounded-3xl px-3"
        onClick={init}
      >
        <Image
          src={address ? "/images/keplr.svg" : "/images/walletconnect.svg"}
          height={20}
          width={20}
          alt="connect wallet"
        />
        <button className="text-sm">
          {address ? ellipsify(address, 4) : "Connect"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
