import isEmpty from "lodash/isEmpty";

export const fetcher = async (key: string, url: string, payload?: any) => {
  let options: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "NFToupon-Key": key,
    },
  };

  options = isEmpty(payload)
    ? options
    : { ...options, body: JSON.stringify(payload) };

  const response = await fetch(url, options);

  const result = await response.json();
  return result;
};
