import React from "react";
import {
  Button,
  Center,
  CenterProps,
  HStack,
  Icon,
  Square,
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
    <Center borderWidth="1px" borderRadius="lg" px="6" py="4">
      <VStack spacing="1">
        <Square size="5" bg="bg-subtle" borderRadius="lg">
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
              name="uploadfile"
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
        </VStack>
      </VStack>
    </Center>
  );
};
