import { CARGO_URL, ERROR_IN_API } from "./constants";
import { fetcher } from "./helper";

export const signValidator = async (key: string, option: any) => {
  let address = null;
  let error = null;
  try {
    const result = await fetcher(key, CARGO_URL, option);
    address = result?.payload;
  } catch (e) {
    error = ERROR_IN_API;
  }

  return { address, error };
};
