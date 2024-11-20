export function shortenAddress(address: string, left = 6, right = 4): string {
  return `${address.slice(0, left)}...${address.slice(-right)}`;
}
