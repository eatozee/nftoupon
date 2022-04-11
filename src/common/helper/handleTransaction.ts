import { Props } from "../Types";
  
export function handleTransaction (
  transactionType: string,
  NFToupon_Key: string,
  URL: string,
  Props?: Props,
) {

    if (transactionType === 'Props') {
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
                address: Props?.address,
                title: Props?.title,
                description: Props?.description,
                status: 'Pending',
                imageUrl: Props?.imageUrl,
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
              status:Props?.status,
              id: Props?.id,
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
          id: Props?.id,
          status: Props?.status, 
          date: Props?.date,
          offer: Props?.offer,
          merchantMerchantCryptoWalletAddress: Props?.merchantCryptoWalletAddress,
          transactionType: Props?.transactionType,
          tokenId: Props?.tokenId,
        }),
      });
    };
    update();
  }
};
