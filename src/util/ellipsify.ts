export function ellipsify(str: string, numCharacters: any): string {
  if (str.length <= numCharacters * 2) {
    return str;
  } else {
    const firstPart = str.substring(0, numCharacters);
    const lastPart = str.substring(str.length - numCharacters);
    return firstPart + "..." + lastPart;
  }
}
