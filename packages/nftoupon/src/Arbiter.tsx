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
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FiClipboard } from "react-icons/fi";
import { Gallery } from "./components/Gallery";
import { images } from "./common/data";

type Props = {
  NFToupon_Key: string;
};

export const Arbiter = ({ NFToupon_Key }: Props) => {
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
                value="This will be an amazing description created by the creator"
                isReadOnly
              />

              <HStack>
                <Box>
                  <FormControl id="offer">
                    <FormLabel htmlFor="offer">Offer</FormLabel>
                    <NumberInput min={1}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="expiryDate">
                    <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
                    <Input type="date" />
                  </FormControl>
                </Box>
              </HStack>
              <Stack py={5} spacing={4} direction={["column", "row"]}>
                <Button
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
    </ChakraProvider>
  );
};
