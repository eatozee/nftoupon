import React from "react";
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
} from "@chakra-ui/react";
import { Dropzone } from "./components/Dropzone";
import { FiClipboard } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Gallery } from "./components/Gallery";
import { images } from "./common/data";

type Props = {
	NFToupon_Key: string;
};

export const Creator = ({ NFToupon_Key }: Props) => {
	const { hasCopied, onCopy } = useClipboard("value");

	console.log("inside the creator component ", hasCopied);

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
							<Box position="absolute" bottom="6" width="full" textAlign="left">
								<Text color="white" fontSize="md" fontWeight="semibold" px="5">
									Category
								</Text>
							</Box>
						</Box>

						<Container maxW="lg" pt={5}>
							<Textarea
								resize={"none"}
								mb={4}
								placeholder="Add a amazing description"
							/>

							<FormControl id="file">
								<Dropzone />
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
					</Box>
				</Container>
			</Box>
		</ChakraProvider>
	);
};
