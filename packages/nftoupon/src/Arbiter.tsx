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
  ButtonGroup,
  IconButton,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Dropzone } from "./components/Dropzone";
import { FiClipboard } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Gallery } from "./components/Gallery";
import { images } from "./common/data";
import { Connect } from "./Connect";

import isEmpty from "lodash/isEmpty";
import { Toaster, toast } from "react-hot-toast";
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
const DETAILS = {
  id: 0,
  title: "",
  description: "",
  imageUrl: "",
  status: "",
  cryptoWalletAddress: "",
  tokenId: "",
};
type NFTouponPayload = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  status: string;
  cryptoWalletAddress: string;
  tokenId: string;
}[];
interface ResponsePayload {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
}
type Props = {
  NFToupon_Key: string;
};
export const Arbiter = ({ NFToupon_Key }: Props) => {
  const { hasCopied, onCopy } = useClipboard("value");

  console.log("inside the creator component ", hasCopied);

  const [transactionType, setTransactionType] = React.useState("");
  const [data, setData] = React.useState<NFTouponPayload>([]);
  const [lockParameter, setLockParameter] = React.useState(true);
  const [offer, setOffer] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [validation, setValidation] = React.useState("");
  const [imageURL, setImageURL] = React.useState<any>(
    "https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/nft-free.webp"
  );
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
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [visible, setVisible] = React.useState(false);
  const closeHandler = () => {
    setVisible(false);
  };
  const [isLoading, setIsLoading] = React.useState(false);
  //Logic for data in pagination where '4' is the data per page
  const [currentPage, setCurrentPage] = React.useState(1);
  const indexOfLastPost = currentPage * 4;
  const indexOfFirstPost = indexOfLastPost - 4;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  const changePage = (page: number) => {
    setCurrentPage(page);
  };
  const connectWallet = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
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
    setLockParameter(false);
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
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [transactionType, NFToupon_Key, details, sendProperties, walletAddress]);
  const rejectHandler = async () => {
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
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const { nftoupons } = await fetcher(
          NFToupon_Key,
          GET_ARBITER_DETAILS_URL
        );
        setData(nftoupons);
        nftoupons.length > 0 &&
          setDetails({
            id: nftoupons[0].id,
            title: nftoupons[0].title,
            description: nftoupons[0].description,
            imageUrl: nftoupons[0].imageUrl,
            status: nftoupons[0].status,
            tokenId: nftoupons[0].tokenId,
            cryptoWalletAddress: nftoupons[0].cryptoWalletAddress,
          });
      } catch (error) {
        toast.error(ERROR_IN_API);
      }
    };
    getDetails();
  }, [transactionType, NFToupon_Key]);

  const sendStatus = async (sendDetails: {
    id: number;
    status: string;
    expiryDate: string;
    offer: string;
    cryptoWalletAddress: string;
    tokenId: string;
  }) => {
    if (isEmpty(offer) && !isEmpty(expiryDate)) {
      setValidation("Empty Offer");
    } else if (!isEmpty(offer) && isEmpty(expiryDate)) {
      setValidation("Empty Date");
    } else if (isEmpty(offer) && isEmpty(expiryDate)) {
      setValidation("Both Empty");
    } else {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Container
        minHeight={"500px"}
        width={"410px"}
        justifyContent="center"
        display={"flex"}
      >
        {isEmpty(walletAddress) ? (
          <Connect
            walletAddress={walletAddress}
            closeHandler={closeHandler}
            visible={visible}
            connectWallet={connectWallet}
            xummPayload={xummPayload}
            isLoading={isLoading}
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
                    spacing="4"
                    p="5"
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                  >
                    <Text fontSize="lg" fontWeight="medium">
                      NFToupon
                    </Text>

                    <Stack spacing="0.2" alignItems={"end"}>
                      <HStack justifyContent={"end"}>
                        <Text
                          sx={{
                            width: "40%",
                            overflow: "hidden",
                            "white-space": "nowrap",
                            "text-overflow": "ellipsis",
                          }}
                          colorScheme="orange"
                          fontSize="sm"
                        >
                          {"r3FGkaZpsAzP5mD4BdnZLHmknVoKRWQLna"}
                        </Text>
                        <Icon
                          onClick={onCopy}
                          ml={2}
                          as={FiClipboard}
                          boxSize="5"
                          color="muted"
                        />
                      </HStack>
                      <Button
                        variant="primary"
                        onClick={() => setWalletAddress("")}
                      >
                        @disconnect
                      </Button>
                    </Stack>
                  </Stack>

                  <Box position="relative" key={"name"} overflow="hidden">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={
                          "https://ipfs.io/ipfs/bafybeiaz5xlxsf4lg7khpmtkaat4dxkhhju5hr2nx7upbzzqpfcsyrcvpa"
                        }
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
                        Category
                      </Text>
                    </Box>
                  </Box>

                  <Container maxW="lg" pt={5}>
                    <Textarea
                      resize={"none"}
                      mb={4}
                      value="This will be an amazing description created by the creator"
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
                                setValidation("");
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
                                setValidation("");
                              }}
                              min={localDate}
                            />
                          </FormControl>
                        </Box>
                      </Stack>
                    </Box>
                    <Stack py={5} spacing={4} direction={["column", "row"]}>
                      <Button
                        isDisabled={lockParameter}
                        bg={"green.400"}
                        color={"white"}
                        w="full"
                        _hover={{
                          bg: "green.500",
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        bg={"red.400"}
                        color={"white"}
                        w="full"
                        _hover={{
                          bg: "red.500",
                        }}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Container>

                  <Gallery images={images} />
                </Box>
              </Container>
            </Box>
          </>
        )}
      </Container>
    </ChakraProvider>
  );
};
