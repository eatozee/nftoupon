import React from "react";
import { Box, Button, Container } from "@chakra-ui/react";
import { NftModal } from "./components/NftModal";
import { Footer } from "./components/Footer";


type ResponsePayload = {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
};

type ConnectProps = {
  connectWallet: () => Promise<void>;
  walletAddress: string;
  visible: boolean;
  closeHandler: () => void;
  xummPayload: ResponsePayload | null;
  isLoading: boolean;
};

export const Connect = (props: ConnectProps) => {
  return (
    <>
      <Box
        as="section"
        pt={{ base: "4", md: "8" }}
        pb={{ base: "12", md: "24" }}
      >
        <Container maxW={"md"}>
          <Box
            width={"410px"}
            bg="bg-surface"
            boxShadow={"md"}
            borderTopWidth="4px"
            borderColor="blue.500"
            borderRadius="md"
          >
            <Box
              minHeight={"500px"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                px={20}
                colorScheme={"blue"}
                bg={"blue.400"}
                _hover={{ bg: "blue.500" }}
                onClick={props.connectWallet}
                isLoading={props.isLoading}
                loadingText="Generating QR"
                spinnerPlacement="start"
              >
                Connect Wallet
              </Button>
            </Box>

            <NftModal {...props} />

            <Footer />
          </Box>
        </Container>
      </Box>
    </>
  );
};