export const getDetailsFetch = async (
  NFToupon_Key: string,
  URL: string,
  Flag: string,
  address?: string
) => {
  if (Flag === 'Arbiter') {
    const respose = await fetch(
      URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
      }
    );
    return await respose.json();
  } else if (Flag === 'Creator') {
    const respose = await fetch(
      URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
        body: JSON.stringify({
          address
        }),
      }
    );
    return await respose.json();
  }
};
