import { Coin } from "@/constants/coins";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export interface UserContextValue {
  initializeUser: () => void;
  setInitialized: (value: boolean) => void;
  Trxpend: boolean;
  initialized: boolean;
  loading: boolean;
  deposit: string;
  lent: string;
  depositCollaterial: (amount: number, token_details: Coin) => Promise<void>;
  createLoan: (
    duration: number,
    interest_rate: number,
    amount: number,
    token_details: Coin
  ) => Promise<void>;
  acceptLoan: (
    loan_idx: number,
    loan_account: string,
    loan_owner_public_key: string,
    token_details: Coin
  ) => Promise<void>;
  availableLoans: any[]; // Replace with actual type
  ellipsify: (str: string, numCharacters: any) => string;
  withdrawCollaterial: (amount: number, token_details: Coin) => Promise<void>;
  getTokenBalance: (mint_: Coin) => Promise<number | undefined>;
  publicKey: PublicKey | null;
  program: Program | undefined; // Replace with the actual type of your program
  userDebt: string;
  findProfileAccounts: () => Promise<void>;
}
