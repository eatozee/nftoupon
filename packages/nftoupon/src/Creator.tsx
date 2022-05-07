import React from "react";
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
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";
import { Dropzone } from "./components/Dropzone";
import { FiClipboard } from "react-icons/fi";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import { Gallery } from "./components/Gallery";
import { images } from "./common/data";
import { PREVIEW_IMAGE_URL } from "./common/constants";

type Props = {
	NFToupon_Key: string;
};

export const Creator = ({ NFToupon_Key }: Props) => {
	const { hasCopied, onCopy } = useClipboard("value");
	const [src, setSrc] = React.useState<any>("");
	const [imageURL, setImageURL] = React.useState<any>(PREVIEW_IMAGE_URL);
	const [textAreaValue, setTextAreaValue] = React.useState<string>("");
	const [charCounter, setCharCounter] = React.useState(0);

	const uploadFile = (event: any) => {
		const reader = new FileReader();
		reader.onload = async function () {
			const binaryData: any = reader.result;
			const byteString = atob(binaryData.split(",")[1]);
			setSrc(byteString);
			setImageURL(binaryData);
		};
		reader.readAsDataURL(event.target.files[0]);
	};

	return (
		<ChakraProvider>
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
											width: "50%",
											overflow: "hidden",
											"white-space": "nowrap",
											"text-overflow": "ellipsis",
										}}
										colorScheme="orange"
										fontSize="sm"
									>
										r4Jsdfafasjfmdm472njehks
									</Text>
									<Icon
										onClick={onCopy}
										ml={2}
										as={FiClipboard}
										boxSize="5"
										color="muted"
									/>
								</HStack>
								<Button variant="primary">@disconnect</Button>
							</Stack>
						</Stack>

						<Box position="relative" key={"name"} overflow="hidden">
							<AspectRatio ratio={16 / 9}>
								<Image src={imageURL} alt={"test"} fallback={<Skeleton />} />
							</AspectRatio>
							<Box
								position="absolute"
								inset="0"
								bgGradient="linear(to-b, transparent 60%, gray.900)"
								boxSize="full"
							/>
							<Box position="absolute" bottom="6" width="full" textAlign="left">
								<Text color="white" fontSize="sm" fontWeight="semibold" px="5">
									{textAreaValue}
								</Text>
							</Box>
						</Box>

						<Container maxW="lg" pt={5}>
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
								colorScheme={"orange"}
								mb={4}
							>{`${charCounter}/200`}</Badge>

							<FormControl id="file">
								<Dropzone uploadFile={uploadFile} />
							</FormControl>

							<Stack
								py={5}
								direction={{ base: "column", md: "row" }}
								spacing="3"
							>
								<Button colorScheme={"yellow"} variant="solid">
									NFToupon
								</Button>
							</Stack>
						</Container>

						<Gallery images={images} />

						<Container as="footer" role="contentinfo" py={5} bgColor="gray.50">
							<Stack justify="space-between" direction="row" align="center">
								<Text fontSize="sm" color="subtle">
									&copy; {new Date().getFullYear()} widget by eatozee
								</Text>
								<ButtonGroup variant="ghost">
									<IconButton
										as="a"
										href="https://discord.gg/5pXbmVDM"
										aria-label="Discord"
										icon={<FaDiscord fontSize="1.25rem" />}
									/>
									<IconButton
										as="a"
										href="https://github.com/eatozee"
										aria-label="GitHub"
										icon={<FaGithub fontSize="1.25rem" />}
									/>
									<IconButton
										as="a"
										href="https://twitter.com/eatozee"
										aria-label="Twitter"
										icon={<FaTwitter fontSize="1.25rem" />}
									/>
								</ButtonGroup>
							</Stack>
						</Container>
					</Box>
				</Container>
			</Box>
		</ChakraProvider>
	);
};
