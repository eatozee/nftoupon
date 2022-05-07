import React from "react";
import {
	Button,
	Center,
	CenterProps,
	HStack,
	Icon,
	Square,
	Text,
	useColorModeValue,
	VStack,
	Input,
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";

interface DropzoneProps extends CenterProps {
	uploadFile: (event: any) => void;
}

export const Dropzone = (props: DropzoneProps) => {
	const { uploadFile } = props;

	return (
		<Center
			borderWidth="1px"
			borderRadius="lg"
			px="6"
			py="4"
			bg={useColorModeValue("white", "gray.800")}
			{...props}
		>
			<VStack spacing="3">
				<Square size="10" bg="bg-subtle" borderRadius="lg">
					<Icon as={FiUploadCloud} boxSize="5" color="muted" />
				</Square>
				<VStack>
					<HStack spacing="1" whiteSpace="nowrap">
						<Input
							id="upload"
							sx={{
								display: "none",
							}}
							type="file"
							name="uploadFile"
							onChange={(event) => uploadFile(event)}
						/>
						<Button
							as={"label"}
							htmlFor="upload"
							variant="link"
							colorScheme="blue"
							size="sm"
							cursor={"pointer"}
						>
							Click to upload
						</Button>
					</HStack>
					<Text fontSize="xs" color="muted">
						PNG, JPG, WEBP or GIF
					</Text>
				</VStack>
			</VStack>
		</Center>
	);
};
