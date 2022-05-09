import * as React from "react";
import {
	ChakraProvider,
	Box,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
} from "@chakra-ui/react";
import { CategoryCard } from "./components/CategoryCard";
import isEmpty from "lodash/isEmpty";
import { ERROR_IN_API, GET_COLLECTIBLES } from "./common/constants";
import { Toaster, toast } from "react-hot-toast";

type Props = {
	NFToupon_Key: string;
};

type ListState = {
	id: string;
	imageUrl: string;
	description: string;
	offer: string;
}[];

export const Collectibles = ({ NFToupon_Key }: Props) => {
	const [list, setList] = React.useState<ListState>([]);

	React.useEffect(() => {
		const getDetails = async () => {
			try {
				const respose = await fetch(GET_COLLECTIBLES, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"NFToupon-Key": NFToupon_Key,
					},
				});
				const { nftoupons } = await respose.json();
				setList(nftoupons);
			} catch (error) {
				toast.error(ERROR_IN_API);
			}
		};

		getDetails();
	}, [NFToupon_Key]);

	return (
		<ChakraProvider>
			<Toaster
				containerStyle={{
					marginTop: "20px",
					position: "absolute",
				}}
			/>
			<Box
				maxW="7xl"
				mx="auto"
				px={{ base: "4", md: "8", lg: "12" }}
				py={{ base: "6", md: "8", lg: "12" }}
			>
				<Stack spacing={{ base: "6", md: "8", lg: "12" }}>
					<Flex
						justify="space-between"
						align={{ base: "start", md: "center" }}
						direction={{ base: "column", md: "row" }}
					>
						<Heading size="lg" mb={{ base: "3", md: "0" }}>
							Collectibles
						</Heading>
					</Flex>
					{!isEmpty(list) ? (
						<SimpleGrid
							columns={{ base: 2, md: 3, lg: 4 }}
							gap={{ base: "4", md: "6", lg: "8" }}
						>
							{list.map((category) => (
								<CategoryCard key={category.id} category={category} />
							))}
						</SimpleGrid>
					) : (
						<div>No data found</div>
					)}
				</Stack>
			</Box>
		</ChakraProvider>
	);
};
