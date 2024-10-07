import { PublicKey } from "@solana/web3.js";

export enum PdaTag {
  USER_DEPOSIT_TAG,
  USER_PROFILE_TAG,
  LOAN_OFFER_TAG,
}

export const getPda = (
  pda: PdaTag,
  authority: PublicKey | null | undefined,
  programId: PublicKey
) => {
  let tag;
  switch (pda) {
    case PdaTag.USER_PROFILE_TAG:
      tag = textToUint8Array("user_profile");
      break;
    case PdaTag.USER_DEPOSIT_TAG:
      tag = textToUint8Array("user_deposit");
      break;
    case PdaTag.LOAN_OFFER_TAG:
      tag = textToUint8Array("loan_offer");
      break;
    default:
      throw new Error("Invalid PDA");
  }

  const seeds = authority ? [tag, authority.toBuffer()] : [tag];
  return PublicKey.findProgramAddressSync(seeds, programId)[0];
};

function textToUint8Array(text: string) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}
