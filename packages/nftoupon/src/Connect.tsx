import {
  Button,
  Image,
  Modal,
  Card,
  Loading,
  Text,
  Spacer,
} from "@nextui-org/react";
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
    <Card css={{ justifyContent: "center" }}>
      <Button
        disabled={props.isLoading}
        bordered={props.isLoading}
        onClick={props.connectWallet}
        iconRight={<Wallet />}
      >
        {props.isLoading ? (
          <Loading type="points" color="default" size="sm" />
        ) : (
          "Connect"
        )}
      </Button>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={props.closeHandler}
      >
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
      <Card.Footer
        css={{
          justifyContent: "center",
        }}
      >
        <Text
          size="14px"
          css={{ display: "flex", alignItems: "center", color: "$gray300" }}
        >
          <Image
            width={32}
            height={23}
            css={{ filter: "grayScale(50%)" }}
            alt="footer logo"
            src="https://djfteveaaqqdylrqovkj.supabase.co/storage/v1/object/public/beta-eatozee-web/banner-resized-img.png"
          />
          widget by
          <Spacer x={0.2} />
          <Text b>eatozee</Text>
        </Text>
      </Card.Footer>
    </Card>
  );
};
