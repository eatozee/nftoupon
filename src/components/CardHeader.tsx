import { Button, Modal, Row, Image } from '@nextui-org/react';
import  isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Wallet } from 'react-iconly';

interface ResponsePayload {
  uuid: string;
  refs: {
    qr_png: string;
    websocket_status: string;
  };
}

type prop = {
  connectWallet: () => Promise<void>;
  walletAddress: string;
  visible: boolean;
  closeHandler: () => void;
  xummPayload: ResponsePayload | null;
};

export const CardHeader = (props: prop) => {
  return (
    <>
      <Row align="center" gap={0} justify="flex-end">
        <Button
          auto
          css={{ pr: '7px', pl: '10px' }}
          light
          color="primary"
          onClick={props.connectWallet}
          icon={<Wallet />}
        />
        
      </Row>
      

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
              src={props.xummPayload?.refs?.qr_png ||  ""}
              alt="qr_code"
            />
          ) : (
            <div>Something went wrong</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="primary" onClick={props.closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
