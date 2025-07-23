import { addCoins, Coin } from "@cosmjs/amino";

export const sumCoins = (coins: Coin[]) => {
  if (coins.length === 0) return undefined;
  const mapped_coins: Record<string, Coin> = {};
  coins.forEach((coin) => {
    if (!mapped_coins[coin.denom]) {
      mapped_coins[coin.denom] = coin;
    } else {
      mapped_coins[coin.denom] = addCoins(mapped_coins[coin.denom], coin);
    }
  });
  return Object.values(mapped_coins);
};
