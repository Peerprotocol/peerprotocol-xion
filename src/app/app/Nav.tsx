"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { shortenAddress } from "@/lib/utils/address-shortener";

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Abstraxion hooks
  const {
    data: { bech32Address },
    isConnected,
    isConnecting,
  } = useAbstraxionAccount();

  // General state hooks
  const [, setShow] = useModal();

  // watch isConnected and isConnecting
  // only added for testing
  useEffect(() => {
    console.log({ isConnected, isConnecting });
  }, [isConnected, isConnecting]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 w-full gap-3">
      {/* Logo for mobile */}
      <div className="md:hidden flex">
        <Image
          src="/images/LogoBlack.svg"
          height={30}
          width={30}
          alt="Logo"
          className="cursor-pointer"
        />
      </div>

      {/* Notification icon hidden on mobile */}
      <div className="hidden md:flex self-end">
        <Image
          src="/images/notification.svg"
          height={30}
          width={30}
          alt="Notification icon"
          className="ml-4"
        />
      </div>

      {/* Dropdown and WalletConnectButton */}
      <div className="flex items-center gap-3">
        {/* <div className="hidden">
          <Dropdown
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
          />
        </div> */}
        {/* <WalletConnectButton network={selectedOption} /> */}
        <Button
          fullWidth
          onClick={() => {
            setShow(true);
          }}
          structure="base"
        >
          {bech32Address ? (
            <div className="flex items-center justify-center">VIEW ACCOUNT</div>
          ) : (
            "CONNECT"
          )}
        </Button>
        {bech32Address && (
          <div className="border-2 border-primary rounded-md p-4 flex flex-row gap-4 text-black">
            <div className="flex flex-row gap-6">
              <div>{shortenAddress(bech32Address)}</div>
            </div>
          </div>
        )}
        <Abstraxion onClose={() => setShow(false)} />
      </div>

      {/* Mobile nav toggle */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={toggleMobileMenu}>
          <Image
            src="/icons/menu.svg"
            height={30}
            width={30}
            alt="Mobile Menu"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="top-2 fixed mx-auto w-[92%] h-[fit-content] bg-white text-black  z-50 flex flex-col rounded-md p-2">
          <div className="w-full bg-[#efefef] flex flex-col gap-4 p-4 items-start text-left rounded-lg">
            <button onClick={toggleMobileMenu} className="self-end mb-4">
              <Image
                src="/icons/close.svg"
                height={30}
                width={30}
                alt="Close Menu"
              />
            </button>

            <ul className="flex flex-col items-start gap-6 text-lg text-left">
              <Link href="/app">
                <li className="flex gap-2">
                  <Image
                    src="/icons/market.svg"
                    height={30}
                    width={30}
                    alt="Notification icon"
                    className=""
                  />
                  Market
                </li>
              </Link>
              <Link href="/profile">
                <li className="flex gap-2">
                  <Image
                    src="/icons/dashboard.svg"
                    height={30}
                    width={30}
                    alt="Notification icon"
                    className=""
                  />
                  Dashboard
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
