export const PAGE_SIZE = 5;

export const xionChainInfo = {
  chainId: "xion-testnet-1",
  chainName: "xion-testnet-1",
  rpc: "https://rpc.xion-testnet-1.burnt.com",
  rest: "https://api.xion-testnet-1.burnt.com",
  stakeCurrency: {
    coinDenom: "XION",
    coinMinimalDenom: "uxion",
    coinDecimals: 6,
    coinGeckoId: "xion",
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "xion",
    bech32PrefixAccPub: "xionpub",
    bech32PrefixValAddr: "xionvaloper",
    bech32PrefixValPub: "xionvaloperpub",
    bech32PrefixConsAddr: "xionvalcons",
    bech32PrefixConsPub: "xionvalconspub",
  },
  currencies: [
    {
      coinDenom: "XION",
      coinMinimalDenom: "uxion",
      coinDecimals: 6,
      coinGeckoId: "xion",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "XION",
      coinMinimalDenom: "uxion",
      coinDecimals: 6,
      coinGeckoId: "xion",
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03,
      },
    },
  ],
};

export const xionContractAddress = "xion1llqv9zhec6mtl2mfv3k4ll2nkrr69wdey5rhp7x27yu2ly790ygqqhmjg6";