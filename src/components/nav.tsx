"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
// import { UserContext } from "./WalletConnectProvider";

const Navbar = () => {
  const { wallets } = useWallet();
  // const pState = useContext(UserContext);
  const [isClient, setisClient] = useState(false);

  useEffect(() => {
    setisClient(true);
  }, []);


  return (
    <nav role="navigation" className="flex justify-between mx-14 my-4">
      <Link href="/">
        {" "}
        <div className="flex gap-3 items-center">
          <div>
            <Image
              src=".\images\logo.svg"
              alt="Description of the image"
              width={55}
              height={55}
            />
          </div>
          <p className="text-2xl">Peer Protocol</p>
        </div>
      </Link>
      <div className="flex" suppressHydrationWarning={true}>
        <div className="flex gap-16">
          <div className="flex items-center gap-8">
            <Link href="/peerapp">
              <p>Portfolio</p>
            </Link>
            <Link href="/deposit">
              <p>Deposit/Withdraw</p>
            </Link>
            <Link href="/borrow">
              <p>Borrow/Lend</p>
            </Link>
            {/* {!initialized ? (
              // <button onClick={initializeUser}>Initialize</button>
              
            ) : (
              <></>
            )} */}
            {isClient && (
              <WalletMultiButton
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  opacity: "90",
                  color: "white",
                  borderRadius: "20px",
                  fontWeight: "100",
                }}
                // disabled
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
