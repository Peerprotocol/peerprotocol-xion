"use client";

import { ReactNode } from "react";
import { deployedContracts } from "@/constants/contracts";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

export const XionAbstractionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <AbstraxionProvider config={{ contracts: deployedContracts }}>
      {children}
    </AbstraxionProvider>
  );
};
