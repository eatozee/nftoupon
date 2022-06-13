import React, { useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Container,
  Stack,
  Text,
  Textarea,
  AspectRatio,
  Image,
  Skeleton,
  FormControl,
  useClipboard,
  Icon,
  HStack,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
} from "@chakra-ui/react";
import { BsClipboardCheck, BsClipboard } from "react-icons/bs";

import { Gallery } from "./components/Gallery";
import { Connect } from "./components/Connect";

import isEmpty from "lodash/isEmpty";
import { toast, Toaster } from "react-hot-toast";
import {
  ERROR_IN_API,
  FAIL_SIGN,
  EXPIRED,
  CARGO_URL,
  CONNECT_WALLET_URL,
  NFTOKEN_CREATOR_OFFER_URL,
  GET_ARBITER_DETAILS_URL,
  ARBITER_BUY_URL,
} from "./common/constants";
import { fetcher } from "./common/helper";
import { Footer } from "./components/Footer";
import { NftModal } from "./components/NftModal";
import useSWR from "swr";

const DETAILS = {
  id: "",
  title: "",
  imageUrl: "",
  description: "",
  status: "",
  merchantCryptoWalletAddress: "",
  cryptoWalletAddress: "",
  date: "",
  offer: "",
  tokenId: "",
  tokenOfferIndex: "",
};

type NFTouponPayload = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  merchantCryptoWalletAddress: string;
  cryptoWalletAddress: string;
  date: string;
  offer: string;
  tokenId: string;
  tokenOfferIndex: string;
}[];

type ResponsePayload = {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
};

type Props = {
  NFToupon_Key: string;
};

const nftouponFetcher = (url: string, apiKey: string) =>
  fetcher(apiKey, url).then((r) => r);

export const Arbiter = ({ NFToupon_Key }: Props) => {
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const { hasCopied, onCopy } = useClipboard(walletAddress);
  const [transactionType, setTransactionType] = React.useState("");
  const [isLoading, setIsLoading] = React.useState({
    connect: false,
    accept: false,
    reject: false,
  });
  const [data, setData] = React.useState<NFTouponPayload>([]);
  const [offer, setOffer] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const localDate = new Date().toLocaleDateString("en-CA");
  const [details, setDetails] = React.useState(DETAILS);
  const [sendProperties, setSendProperties] = React.useState({
    expiryDate: "",
    offer: "",
    cryptoWalletAddress: "",
    status: "",
  });
  const [xummPayload, setXummPayload] = React.useState<ResponsePayload | null>(
    null
  );
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => {
    setVisible(false);
  };
  const [nftDetailIndex, setNftDetailIndex] = React.useState(0);

  const { data: arbiterNfTouponData, error } = useSWR(
    isEmpty(walletAddress) ? null : [GET_ARBITER_DETAILS_URL, NFToupon_Key],
    nftouponFetcher,
    { refreshInterval: 2000 }
  );

  const updateNFTDetails = (index: number) => {
    setNftDetailIndex(index);
    setDetails(arbiterNfTouponData?.nftoupons[index]);
  };

  const connectWallet = async () => {
    setIsLoading({ ...isLoading, connect: true });
    try {
      const { payload } = await fetcher(NFToupon_Key, CONNECT_WALLET_URL);
      if (!isEmpty(payload)) {
        setXummPayload(payload);
        setVisible(true);
      } else {
        setXummPayload(null);
      }
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
    setIsLoading({ ...isLoading, connect: false });
  };

  const closeSocket = (ws: WebSocket) => {
    ws.close();
    setXummPayload(null);
    setVisible(false);
  };

  const signValidator = async (option: any, ws: WebSocket) => {
    const result = await fetcher(NFToupon_Key, CARGO_URL, option);
    setWalletAddress(result?.payload);
    setTransactionType(result?.tx_type);
    closeSocket(ws);
  };

  useEffect(() => {
    if (!isEmpty(xummPayload)) {
      const wsURL = xummPayload?.refs?.websocket_status;
      const ws = new WebSocket(wsURL || "");
      ws.onmessage = (event) => {
        const { opened, payload_uuidv4, signed, expired } = JSON.parse(
          event.data
        );
        if (opened) {
        } else if (expired) {
          closeSocket(ws);
          toast.error(EXPIRED);
        } else if (!isEmpty(payload_uuidv4) && !signed) {
          closeSocket(ws);
          toast.error(FAIL_SIGN);
        } else if (signed) {
          const option = { payload_uuidv4 };
          signValidator(option, ws);
        }
      };
    }
  }, [xummPayload, NFToupon_Key]);

  useEffect(() => {
    if (transactionType === "NFTokenCreateOffer") {
      try {
        const update = async () => {
          const options = {
            id: details.id,
            status: sendProperties.status,
            date: sendProperties.expiryDate,
            offer: sendProperties.offer,
            merchantCryptoWalletAddress: walletAddress,
            transactionType,
            tokenId: details.tokenId,
          };
          await fetcher(NFToupon_Key, NFTOKEN_CREATOR_OFFER_URL, options);
        };
        update();
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
      if (transactionType === "NFTokenCreateOffer") {
        setTransactionType("");
      }
    }
  }, [transactionType, NFToupon_Key, details, sendProperties, walletAddress]);

  const rejectHandler = async () => {
    setIsLoading({ ...isLoading, reject: true });
    try {
      const options = {
        id: details.id,
        status: "Rejected",
        date: "",
        offer: "",
        merchantCryptoWalletAddress: walletAddress,
        transactionType: "",
      };
      await fetcher(NFToupon_Key, NFTOKEN_CREATOR_OFFER_URL, options);
    } catch (error) {
      toast.error(ERROR_IN_API);
    }
    setIsLoading({ ...isLoading, reject: false });
  };

  useEffect(() => {
    arbiterNfTouponData?.nftoupons.length > 0 &&
      setDetails({
        ...arbiterNfTouponData?.nftoupons[0],
      });
  }, [arbiterNfTouponData]);

  const sendStatus = async (sendDetails: {
    id: string;
    status: string;
    expiryDate: string;
    offer: string;
    cryptoWalletAddress: string;
    tokenId: string;
  }) => {
    if (isEmpty(offer) && !isEmpty(expiryDate)) {
      toast.error("Please add the Offer");
    } else if (!isEmpty(offer) && isEmpty(expiryDate)) {
      toast.error("Please add Expiry Date");
    } else if (isEmpty(offer) && isEmpty(expiryDate)) {
      toast.error("Empty Offer and Date");
    } else {
      setIsLoading({ ...isLoading, accept: true });
      try {
        const options = {
          offer: sendDetails.offer,
          merchantCryptoWalletAddress: walletAddress,
          address: sendDetails.cryptoWalletAddress,
          tokenId: sendDetails.tokenId,
        };
        const { payload } = await fetcher(
          NFToupon_Key,
          ARBITER_BUY_URL,
          options
        );
        if (!isEmpty(payload)) {
          setSendProperties({
            status: sendDetails.status,
            expiryDate: sendDetails.expiryDate,
            offer: sendDetails.offer,
            cryptoWalletAddress: sendDetails.cryptoWalletAddress,
          });
          setXummPayload(payload);
          setVisible(true);
        } else {
          setXummPayload(null);
        }
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
      setIsLoading({ ...isLoading, accept: false });
    }
  };

  return (
    <ChakraProvider>
      <Toaster
        containerStyle={{
          marginTop: "20px",
          position: "absolute",
        }}
      />
      {isEmpty(walletAddress) ? (
        <Connect
          walletAddress={walletAddress}
          closeHandler={closeHandler}
          visible={visible}
          connectWallet={connectWallet}
          xummPayload={xummPayload}
          isLoading={isLoading.connect}
        />
      ) : (
        <>
          <Box
            as="section"
            pt={{ base: "4", md: "8" }}
            pb={{ base: "12", md: "24" }}
          >
            <Container maxW={"md"}>
              <Box
                bg="bg-surface"
                boxShadow={"md"}
                borderTopWidth="4px"
                borderColor="blue.500"
                borderRadius="md"
              >
                <Stack
                  spacing="3"
                  p="3"
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                >
                  <Text fontSize="md" fontWeight="bold">
                    NFToupon
                  </Text>

                  <Stack spacing="0.2" alignItems={"end"}>
                    <HStack justifyContent={"end"}>
                      <Text
                        sx={{
                          width: "40%",
                        }}
                        colorScheme="orange"
                        fontSize="sm"
                        isTruncated
                      >
                        {walletAddress}
                      </Text>
                      <Icon
                        onClick={onCopy}
                        as={hasCopied ? BsClipboardCheck : BsClipboard}
                        boxSize="4"
                        color={hasCopied ? "green.500" : "muted"}
                        cursor={"pointer"}
                      />
                    </HStack>
                    <Button
                      colorScheme={"red"}
                      variant="ghost"
                      onClick={() => setWalletAddress("")}
                    >
                      @disconnect
                    </Button>
                  </Stack>
                </Stack>
                {arbiterNfTouponData?.nftoupons.length > 0 ? (
                  <>
                    <Box position="relative" key={"name"} overflow="hidden">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={details.imageUrl}
                          alt={"test"}
                          fallback={<Skeleton />}
                        />
                      </AspectRatio>
                      <Box
                        position="absolute"
                        inset="0"
                        bgGradient="linear(to-b, transparent 60%, gray.900)"
                        boxSize="full"
                      />
                      <Box
                        position="absolute"
                        bottom="6"
                        width="full"
                        textAlign="left"
                      >
                        <Text
                          color="white"
                          fontSize="md"
                          fontWeight="semibold"
                          px="5"
                        >
                          {details.description}
                        </Text>
                      </Box>
                    </Box>

                    <Container maxW="lg" pt={5}>
                      <Textarea
                        resize={"none"}
                        mb={4}
                        value={details.description}
                        isReadOnly
                      />

                      <Box as="form">
                        <Stack spacing={4} direction={["column", "row"]}>
                          <Box>
                            <FormControl id="offer" isRequired>
                              <FormLabel htmlFor="offer">Offer</FormLabel>
                              <NumberInput
                                onChange={(e) => {
                                  setOffer(e);
                                }}
                                min={1}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          </Box>
                          <Box>
                            <FormControl id="expiryDate" isRequired>
                              <FormLabel htmlFor="expiryDate">
                                Expiry Date
                              </FormLabel>
                              <Input
                                type="date"
                                onChange={(e) => {
                                  setExpiryDate(e.target.value);
                                }}
                                min={localDate}
                              />
                            </FormControl>
                          </Box>
                        </Stack>
                      </Box>
                      <Stack py={5} spacing={4} direction={["column", "row"]}>
                        <Button
                          onClick={() => {
                            sendStatus({
                              id: details.id,
                              status: "Offered",
                              expiryDate: expiryDate,
                              offer: offer,
                              cryptoWalletAddress: details.cryptoWalletAddress,
                              tokenId: details.tokenId,
                            });
                          }}
                          w="full"
                          colorScheme={"green"}
                          loadingText="Offering..."
                          isLoading={isLoading.accept}
                        >
                          Offer
                        </Button>
                        <Button
                          w="full"
                          colorScheme={"red"}
                          onClick={rejectHandler}
                          loadingText="Rejecting..."
                          isLoading={isLoading.reject}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Container>

                    {!isEmpty(arbiterNfTouponData?.nftoupons) && (
                      <Gallery
                        images={arbiterNfTouponData?.nftoupons}
                        nftDetailIndex={nftDetailIndex}
                        setNftDetailIndex={updateNFTDetails}
                      />
                    )}
                  </>
                ) : (
                  <Box
                    minH={"500px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Heading>No Data Found</Heading>
                  </Box>
                )}
                <Footer />
              </Box>
            </Container>
            <NftModal
              closeHandler={closeHandler}
              visible={visible}
              xummPayload={xummPayload}
            />
          </Box>
        </>
      )}
    </ChakraProvider>
  );
};
