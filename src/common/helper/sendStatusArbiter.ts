import { Props } from "../Types"

export const sendStatusArbiter = async (NFToupon_Key: string, URL: string, Props?: Props) => {
    const response = await fetch(
        URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'NFToupon-Key': NFToupon_Key,
          },
          body: JSON.stringify({
            offer: Props?.offer,
            merchantCryptoWalletAddress: Props?.address,
            address: Props?.merchantCryptoWalletAddress,
            tokenId: Props?.tokenId,
          }),
        }
    );
  return await response.json();  
}