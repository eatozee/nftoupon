import { Col, Link, Text } from '@nextui-org/react';
import React from 'react';

type prop = {
  disConnectWallet: () => void;
  walletAddress: string;
};

export const Header = (props: prop) => {
  return (
    <Col>
      <Text css={{ overflow: 'hidden', textOverflow: 'ellipsis' }} size="sm">
        {props.walletAddress}
      </Text>
      <Link onClick={props.disConnectWallet}>@disconnect</Link>
    </Col>
  );
};
