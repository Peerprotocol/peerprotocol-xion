import {
  BroadcastMode,
  ChainInfo,
  Keplr,
  Key,
  StdFee,
} from "@keplr-wallet/types";
import { AccountResponse } from "../types/account";
import { api } from "./api";
import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from "../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import { SignMode } from "../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";
import { PubKey } from "../proto-types-gen/src/cosmos/crypto/secp256k1/keys";
import { Any } from "../proto-types-gen/src/google/protobuf/any";
import Long from "long";
import { Buffer } from "buffer";
import { TendermintTxTracer, verifyADR36Amino } from "@keplr-wallet/cosmos";
import { Hash, PubKeySecp256k1, PrivKeySecp256k1 } from "@keplr-wallet/crypto";

function sortedJsonByKeyStringify(obj: Record<string, any>): string {
  return JSON.stringify(sortObjectByKey(obj));
}

function sortObjectByKey(obj: Record<string, any>): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectByKey);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, any> = {};
  sortedKeys.forEach((key) => {
    result[key] = sortObjectByKey(obj[key]);
  });
  return result;
}

function serializeSignDoc(signDoc: any): Uint8Array {
  return Buffer.from(escapeHTML(sortedJsonByKeyStringify(signDoc)));
}

function escapeHTML(str: string): string {
  return str
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function makeADR36AminoSignDoc(signer: string, data: string | Uint8Array) {
  if (typeof data === "string") {
    data = Buffer.from(data).toString("base64");
  } else {
    data = Buffer.from(data).toString("base64");
  }

  return {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer,
          data,
        },
      },
    ],
    memo: "",
  };
}
export const signMessageOff = () => {
  const cryptoPrivKey = new PrivKeySecp256k1(
    Uint8Array.from([
      133, 219, 253, 140, 154, 193, 246, 202, 184, 254, 1, 117, 201, 49, 59,
      183, 41, 197, 159, 90, 162, 17, 115, 205, 7, 157, 227, 180, 237, 80, 85,
      210,
    ])
  );
  const signDoc = makeADR36AminoSignDoc(
    "osmo1f36h4udjp9yxaewrrgyrv75phtemqsag365y9t",
    "ei282kdls"
  );
  console.log(signDoc);
  const msg = serializeSignDoc(signDoc);
  console.log(msg[22]);
  console.log(Hash.sha256(msg));

  const signature = cryptoPrivKey.signDigest32(Hash.sha256(msg));

  // if (algo === "ethsecp256k1") {
  //   return Hash.keccak256(msg);
  // }

  // console.log(signature.r);

  // console.log(Array.from(signature.r).concat(Array.from(signature.s)));

  // concat uint8array

  // new Uint8Array() + new Uint8Array();
  // [...signature.r];

  // new Uint8Array([...signature.r, ...signature.s]);
};

export const signMessage = async (
  keplr: Keplr,
  chainInfo: ChainInfo,
  key: Key
) => {
  const a = keplr.getOfflineSigner(chainInfo.chainId);

  const message = "we hekkiyhr0-";
  // 2le37DYO2oBzuLZjao5lmllkdYY0VRvKDHjBuaPWWBwvgpIuJC0W4+d6zRrZVskuMCqJUyRpwt/AoWnZMU5V9Q==
  try {
    const sign = await keplr.signArbitrary(
      chainInfo.chainId,
      key.bech32Address,
      message
    );
    console.log("we here --------cc");
    console.log(JSON.stringify(sign));

    const signatureBuffer = Buffer.from(sign.signature, "base64");

    const uint8Signature = new Uint8Array(signatureBuffer); // Convert the buffer to an Uint8Array

    const verified = verifyADR36Amino(
      chainInfo.bech32Config!.bech32PrefixAccAddr,
      key.bech32Address,
      message,
      key.pubKey,
      uint8Signature
    );

    console.log(verified);
  } catch (error) {
    console.log(error);
  }
  // const verified = await keplr.verifyArbitrary(
  //   chainInfo.chainId,
  //   sender,
  //   "hello",
  //   sign
  // );

  // console.log(verified);
};

export const sendMsgs = async (
  keplr: Keplr,
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: StdFee,
  memo: string = ""
) => {
  const account = await fetchAccountInfo(chainInfo, sender);
  const { pubKey } = await keplr.getKey(chainInfo.chainId);
  const { account_number, sequence } = (account as any)?.base_account;
  if (account) {
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: fee.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: fee.gas,
        }),
      }).finish(),
      chainId: chainInfo.chainId,
      accountNumber: Long.fromString(account_number),
    };

    const authinfo = AuthInfo.decode(signDoc.authInfoBytes);

    console.log(authinfo);

    const signed = await keplr.signDirect(chainInfo.chainId, sender, signDoc);
    console.log(Buffer.from(signed.signature.signature, "base64"));
    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    };

    return;

    const txHash = await broadcastTxSync(keplr, chainInfo.chainId, signedTx.tx);
    const txTracer = new TendermintTxTracer(chainInfo.rpc, "/websocket");
    txTracer.traceTx(txHash).then((tx) => {
      alert("Transaction commit successfully");
    });
  }
};

export const fetchAccountInfo = async (
  chainInfo: ChainInfo,
  address: string
) => {
  try {
    const uri = `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await api<AccountResponse>(uri);

    return response.account;
  } catch (e) {
    console.error(
      "This may be a new account. Please send some tokens to this account first."
    );
    return undefined;
  }
};

export const broadcastTxSync = async (
  keplr: Keplr,
  chainId: string,
  tx: Uint8Array
): Promise<Uint8Array> => {
  return keplr.sendTx(chainId, tx, "sync" as BroadcastMode);
};
