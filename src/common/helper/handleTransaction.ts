type NFTokenMint = {
  id?: number;
  address?: string;
  title?: string;
  description?: string;
  status?: string;
  imageUrl?: string | undefined;
  date?: string;
  offer?: string;
  merchantMerchantCryptoWalletAddress?: string;
  transactionType?: string;
  tokenId?: string;
};

  
export function handleTransaction (
  transactionType: string,
  NFToupon_Key: string,
  URL: string,
  NFTokenMint?: NFTokenMint,
) {

    if (transactionType === 'NFTokenMint') {
        const saveTokens = async () => {
          await fetch(
            URL,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'NFToupon-Key': NFToupon_Key,
              },
              body: JSON.stringify({
                address: NFTokenMint?.address,
                title: NFTokenMint?.title,
                description: NFTokenMint?.description,
                status: 'Pending',
                imageUrl: NFTokenMint?.imageUrl,
              }),
            }
          );
        };
        saveTokens();
      } else if (transactionType === 'NFTokenAcceptOffer') {
        const updateTokenStatus = async () => {
          await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'NFToupon-Key': NFToupon_Key,
            },
            body: JSON.stringify({
              status:NFTokenMint?.status,
              id: NFTokenMint?.id,
            }),
          });
        };
        updateTokenStatus();
      }

  if (transactionType === 'NFTokenCreateOffer') {
    const update = async () => {
      await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
        body: JSON.stringify({
          id: NFTokenMint?.id,
          status: NFTokenMint?.status, 
          date: NFTokenMint?.date,
          offer: NFTokenMint?.offer,
          merchantMerchantCryptoWalletAddress: NFTokenMint?.merchantMerchantCryptoWalletAddress,
          transactionType: NFTokenMint?.transactionType,
          tokenId: NFTokenMint?.tokenId,
        }),
      });
    };
    update();
  }
};
