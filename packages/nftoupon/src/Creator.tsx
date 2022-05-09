import React, { useEffect } from "react";
import {
	ChakraProvider,
	Box,
	Badge,
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
	InputGroup,
	InputLeftElement,
	Input,
} from "@chakra-ui/react";
import { Dropzone } from "./components/Dropzone";
import { FiArrowLeft, FiCalendar, FiSend } from "react-icons/fi";
import { BsClipboardCheck, BsClipboard } from "react-icons/bs";
import { GrCurrency } from "react-icons/gr";
import { Gallery } from "./components/Gallery";
import {
	ACCEPT_OFFER_URL,
	CARGO_URL,
	CONNECT_WALLET_URL,
	CREATOR_REJECT_OFFER_URL,
	CREATOR_SEND_DETAILS_URL,
	DEFAULT_PREVIEW_IMG_URL,
	ERROR_IN_API,
	EXPIRED,
	FAIL_SIGN,
	GET_META_URL,
	NFTOKEN_ACCEPT_OFFER_URL,
	NFTOKEN_MINT_URL,
	PREVIEW_IMAGE_URL,
} from "./common/constants";
import { Connect } from "./components/Connect";
import isEmpty from "lodash/isEmpty";
import { fetcher } from "./common/helper";
import confetti from "canvas-confetti";
import { Toaster, toast } from "react-hot-toast";
import { Footer } from "./components/Footer";
import { NftModal } from "./components/NftModal";

type Props = {
	NFToupon_Key: string;
};

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

type ResponsePayload = {
	uuid: string;
	refs: {
		qr_png: string;
		websocket_status: string;
	};
	imageUrl: string;
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

export const Creator = ({ NFToupon_Key }: Props) => {
	const [imageURL, setImageURL] = React.useState<any>(PREVIEW_IMAGE_URL);
	const [textAreaValue, setTextAreaValue] = React.useState<string>("");
	const [charCounter, setCharCounter] = React.useState(0);

	const [visible, setVisible] = React.useState(false);
	const closeHandler = () => setVisible(false);
	const [details, setDetails] = React.useState(DETAILS);
	const [xummPayload, setXummPayload] = React.useState<ResponsePayload | null>(
		null
	);
	const [walletAddress, setWalletAddress] = React.useState<string>("");
	const { hasCopied, onCopy } = useClipboard(walletAddress);
	const [transactionType, setTransactionType] = React.useState<string>("");

	const [isLoading, setIsLoading] = React.useState({
		connect: false,
		nftoupon: false,
		accept: false,
		reject: false,
	});
	const [data, setData] = React.useState<NFTouponPayload>([]);

	const [base64String, setBase64String] = React.useState<string | null>(null);
	const [nftDetailIndex, setNftDetailIndex] = React.useState(0);

	const handleConfetti = () => {
		confetti({
			zIndex: 999,
			particleCount: 1000,
			spread: 180,
			origin: { y: 0.5 },
		});
	};

	const updateNFTDetails = (index: number) => {
		setNftDetailIndex(index);
		setDetails(data[index]);
	};

	const uploadFile = (event: any) => {
		const reader = new FileReader();
		reader.onload = async function () {
			/* Base64 is a binary-to-text encoding scheme used to 
			  transport data. The encoding is necessary when the transfer 
			  medium is not able to handle binary data. 
			  This binary data is then translated to a text representation (base64) and transferred as text. */

			// base64 is an algorithm for encoding and decoding an object to ASCII format.
			const base64String: any = reader.result;

			setBase64String(base64String.split(",")[1]);
			setImageURL(base64String);
		};
		reader.readAsDataURL(event.target.files[0]);
	};

	const acceptOffer = async () => {
		setIsLoading({ ...isLoading, accept: true });
		try {
			const options = {
				tokenOfferIndex: details.tokenOfferIndex,
				address: walletAddress,
			};
			const { payload } = await fetcher(
				NFToupon_Key,
				ACCEPT_OFFER_URL,
				options
			);

			if (!isEmpty(payload)) {
				setXummPayload(payload);
				setVisible(true);
			} else {
				setXummPayload(null);
			}
		} catch (error) {
			toast.error(ERROR_IN_API);
		}
		setNftDetailIndex(0);
		setDetails(DETAILS);
		setIsLoading({ ...isLoading, accept: false });
	};

	const rejectOffer = async () => {
		setIsLoading({ ...isLoading, reject: true });
		try {
			const options = { status: "Declined", id: details.id };
			await fetcher(NFToupon_Key, CREATOR_REJECT_OFFER_URL, options);
		} catch (error) {
			toast.error(ERROR_IN_API);
		}
		setNftDetailIndex(0);
		setDetails(DETAILS);
		setIsLoading({ ...isLoading, reject: false });
	};

	const sendDetails = async () => {
		if (isEmpty(textAreaValue.trim()) && !isEmpty(base64String)) {
			toast.error("Please add the description");
		} else if (isEmpty(base64String) && !isEmpty(textAreaValue.trim())) {
			toast.error("Please upload an image");
		} else if (isEmpty(textAreaValue.trim()) && isEmpty(base64String)) {
			toast.error("Empty text Area and Image");
		} else {
			setIsLoading({ ...isLoading, nftoupon: true });
			try {
				const options = {
					file: base64String,
					address: walletAddress,
				};
				const { payload } = await fetcher(
					NFToupon_Key,
					CREATOR_SEND_DETAILS_URL,
					options
				);

				if (!isEmpty(payload)) {
					setXummPayload(payload);
					setVisible(true);
				} else {
					setXummPayload(null);
				}
			} catch (error) {
				toast.error(ERROR_IN_API);
			}
			setIsLoading({ ...isLoading, nftoupon: false });
		}
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

	useEffect(() => {
		const getDetails = async () => {
			try {
				const options = { address: walletAddress };
				const { nftoupons } = await fetcher(
					NFToupon_Key,
					GET_META_URL,
					options
				);

				setData(nftoupons);
			} catch (error) {
				toast.error(ERROR_IN_API);
			}
		};
		if (!isEmpty(walletAddress)) {
			getDetails();
		}
	}, [walletAddress, transactionType, NFToupon_Key]);

	const signValidator = async (option: any, ws: WebSocket) => {
		try {
			const result = await fetcher(NFToupon_Key, CARGO_URL, option);
			setWalletAddress(result?.payload);
			setTransactionType(result?.tx_type);
			closeSocket(ws);
		} catch (error) {
			toast.error(ERROR_IN_API);
		}
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
		try {
			if (transactionType === "NFTokenMint") {
				const saveTokens = async () => {
					const options = {
						address: walletAddress,
						title: "",
						description: textAreaValue,
						status: "Pending",
						imageUrl: xummPayload?.imageUrl,
					};
					await fetcher(NFToupon_Key, NFTOKEN_MINT_URL, options);
				};
				saveTokens();
				handleConfetti();
			} else if (transactionType === "NFTokenAcceptOffer") {
				const updateTokenStatus = async () => {
					const options = { status: "Accepted", id: details.id };
					await fetcher(NFToupon_Key, NFTOKEN_ACCEPT_OFFER_URL, options);
				};
				updateTokenStatus();
			}
		} catch (error) {
			toast.error(ERROR_IN_API);
		}
		if (
			transactionType === "NFTokenAcceptOffer" ||
			transactionType === "NFTokenMint"
		) {
			// reset to default
			setTextAreaValue("");
			setDetails(DETAILS);
			setImageURL(DEFAULT_PREVIEW_IMG_URL);
			setTransactionType("");
		}
	}, [
		transactionType,
		walletAddress,
		details,
		textAreaValue,
		xummPayload,
		NFToupon_Key,
	]);

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
								p="3"
								direction={{ base: "column", sm: "row" }}
								justify="space-between"
							>
								{isEmpty(details.id) ? (
									<Text fontSize="md" fontWeight="bold">
										NFToupon
									</Text>
								) : (
									<Icon
										onClick={() => {
											setNftDetailIndex(0);
											setDetails(DETAILS);
										}}
										as={FiArrowLeft}
										boxSize="5"
										color="muted"
										cursor="pointer"
									/>
								)}

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

							<Box position="relative" key={"name"} overflow="hidden">
								<AspectRatio ratio={16 / 9}>
									<Image
										src={
											!isEmpty(details.imageUrl) ? details.imageUrl : imageURL
										}
										alt={"Preview Image"}
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
										fontSize="sm"
										fontWeight="semibold"
										px="5"
									>
										{!isEmpty(details.description)
											? details.description
											: textAreaValue}
									</Text>
								</Box>
							</Box>

							<Container maxW="lg" pt={5}>
								{isEmpty(details.id) && (
									<>
										<Textarea
											resize={"none"}
											mb={1}
											placeholder="Add a amazing description"
											value={textAreaValue}
											onChange={(ev: any): void => {
												const length = ev.target.value.length;

												if (length <= 200) {
													setTextAreaValue(ev.target.value);
													setCharCounter(length);
												}
											}}
										/>
										<Badge
											colorScheme={"muted"}
											mb={4}
										>{`${charCounter}/200`}</Badge>
										<FormControl id="file">
											<Dropzone uploadFile={uploadFile} />
										</FormControl>
									</>
								)}

								{!isEmpty(details.offer) && (
									<Stack
										py={5}
										direction={{ base: "column", md: "row" }}
										spacing="3"
									>
										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												children={<GrCurrency />}
											/>
											<Input isReadOnly={true} value={details.offer} />
										</InputGroup>

										<InputGroup>
											<InputLeftElement
												pointerEvents="none"
												children={<FiCalendar />}
											/>
											<Input isReadOnly={true} value={details.date} />
										</InputGroup>
									</Stack>
								)}

								{details.status === "Declined" && (
									<Text color={"gray"} fontSize="md" fontWeight="semibold">
										You have declined this offer
									</Text>
								)}

								<Stack
									py={5}
									direction={{ base: "column", md: "row" }}
									spacing="3"
								>
									{!isEmpty(details.id) && details.status !== "Declined" ? (
										<>
											{details.status === "Pending" ||
											details.status === "Rejected" ? (
												<Text fontSize="md" fontWeight="semibold">
													Your offer is
													<Text
														as={details.status === "Rejected" ? "del" : "samp"}
														px={2}
														color={
															details.status === "Rejected"
																? "red.500"
																: "orange.500"
														}
													>
														{details.status}
													</Text>
												</Text>
											) : (
												<>
													<Button
														w="full"
														colorScheme={"green"}
														onClick={acceptOffer}
														isLoading={isLoading.accept}
														loadingText="Accepting..."
													>
														Accept
													</Button>

													<Button
														w="full"
														colorScheme={"red"}
														onClick={rejectOffer}
														isLoading={isLoading.reject}
														loadingText="Rejecting..."
													>
														Reject
													</Button>
												</>
											)}
										</>
									) : (
										details.status !== "Pending" &&
										details.status !== "Declined" &&
										details.status !== "Rejected" && (
											<Button
												rightIcon={<FiSend />}
												colorScheme={"yellow"}
												variant="solid"
												onClick={sendDetails}
												isLoading={isLoading.nftoupon}
												loadingText="Minting..."
											>
												NFToupon
											</Button>
										)
									)}
								</Stack>
							</Container>

							{!isEmpty(data) && (
								<Gallery
									images={data}
									nftDetailIndex={nftDetailIndex}
									setNftDetailIndex={updateNFTDetails}
								/>
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
			)}
		</ChakraProvider>
	);
};
