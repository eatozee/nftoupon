export const creatorAcceptOffer = async (NFToupon_Key: string, URL:string, tokenOfferIndex: string, address: string ) => {
    const response = await fetch(
        URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'NFToupon-Key': NFToupon_Key,
          },
          body: JSON.stringify({
            tokenOfferIndex: tokenOfferIndex,
            address: address,
          }),
        }
      );
      return await response.json();    
}