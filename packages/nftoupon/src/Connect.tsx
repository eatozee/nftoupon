import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Image,
} from "@chakra-ui/react";
import React from "react";
import isEmpty from "lodash/isEmpty";
import { Wallet } from "react-iconly";

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
      <Box>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blue"}
          bg={"blue.400"}
          _hover={{ bg: "blue.500" }}
          onClick={props.connectWallet}
        >
          Connect
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
            <ModalBody>
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
    </>
  );
};
