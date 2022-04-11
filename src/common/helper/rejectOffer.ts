import { Props } from "../Types"
export const rejectOffer = async (NFToupon_Key: string, URL: string, flag: string, Props: Props) => {
    if(flag === "Arbiter"){
        await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'NFToupon-Key': NFToupon_Key,
      },
      body: JSON.stringify({
        id: Props?.id,
        status: 'Rejected',
        date: '',
        offer: '',
        merchantCryptoWalletAddress: Props?.merchantCryptoWalletAddress,
        transactionType: '',
      }),
    });
    }
    else if(flag === "Creator"){
      await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'NFToupon-Key': NFToupon_Key,
      },
      body: JSON.stringify({
        status: 'Declined',
        id: Props.id,
      }),
    });
    }
  }