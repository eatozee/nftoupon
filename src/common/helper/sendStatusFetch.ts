export const sendStatusFetch = async (
  NFToupon_Key: string,
  URL: string,
  address: string,
  src: any,
) => {
  const response = await fetch(URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'NFToupon-Key': NFToupon_Key,
      },
      body: JSON.stringify({
        file: src,
        address: address,
      }),
    }
  );
  return await response.json();
};
