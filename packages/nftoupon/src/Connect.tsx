import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Image,
  Container,
} from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";

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
            bg="bg-surface"
            boxShadow={"md"}
            borderTopWidth="4px"
            borderColor="blue.500"
            borderRadius="md"
            minHeight={"500px"}
            width={"410px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Button
              rounded={"full"}
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
            <Modal
              isCentered
              onClose={props.closeHandler}
              isOpen={props.visible}
              motionPreset="scale"
              size={"md"}
              aria-labelledby="modal-title"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody margin={5}>
                  <>
                    {!isEmpty(props.xummPayload) ? (
                      <Image
                        width="100%"
                        height="100%"
                        src={props.xummPayload?.refs?.qr_png || ""}
                        alt="qr_code"
                      />
                    ) : (
                      <div>Something went wrong</div>
                    )}
                  </>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Container>
      </Box>
    </>
  );
};
