import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";

type ResponsePayload = {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
};

type NftModalProps = {
  connectWallet?: () => Promise<void>;
  walletAddress?: string;
  visible: boolean;
  closeHandler: () => void;
  xummPayload: ResponsePayload | null;
  isLoading?: boolean;
};

export const NftModal = (props: NftModalProps) => {
  return (
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
