export const cargo =  (NFToupon_Key: string, URL: string, payload_uuidv4:any) => {
    const response =  fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'NFToupon-Key': NFToupon_Key,
        },
        body: JSON.stringify({
          payload_uuidv4,
        }),
      });
    return response;
}