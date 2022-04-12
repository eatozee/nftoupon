export const fetchCollectWallet = async(NFToupon_Key: string)=> {
    const response = await fetch(
        `https://eatozee-crypto.app/api/nftoupon/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'NFToupon-Key': NFToupon_Key,
          },
        }
      );
      return await response.json();    
};