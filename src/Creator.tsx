import React from 'react';
import {
  NextUIProvider,
  createTheme,
  Button,
  Card,
  Divider,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
  Switch,
} from '@nextui-org/react';
import { Send } from 'react-iconly';
import { BiSun, BiMoon } from 'react-icons/bi';
import isEmpty from 'lodash/isEmpty';

const myDarkTheme = createTheme({
  type: 'dark',
});

const lightTheme = createTheme({
  type: 'light',
});

interface CreatorProps {
  xummConfig: {
    XUMM_APIKEY: String;
    XUMM_APISECRET: String;
  };
}
interface ResponsePayload {
  payload: {
    uuid: string;
    refs: {
      qr_png: string;
      websocket_status: string;
    };
  };
  error: string;
}

export const Creator = (props: CreatorProps) => {
  const [isDark, setIsDark] = React.useState(false);
  const { xummConfig } = props;
  const { XUMM_APIKEY, XUMM_APISECRET } = xummConfig;

  const connectWallet = async () => {
    // just a placeholder will change with the real one
    try {
      const response = await fetch('http://localhost:3000/api/payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          XUMM_APIKEY,
          XUMM_APISECRET,
        }),
      });

      const { payload, error }: ResponsePayload = await response.json();
      console.log({ payload, error });

      if (!isEmpty(payload)) {
        const wsURL = payload.refs.websocket_status;
        const ws = new WebSocket(wsURL);
        ws.onmessage = (event) => {
          console.log(event.data);
        };
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log('error ', error);
    }
  };

  return (
    <NextUIProvider theme={isDark ? myDarkTheme : lightTheme}>
      <Card css={{ mw: '330px' }}>
        <Card.Header>
          <Row justify="space-between">
            <Text b size={18}>
              NFToupon Generator
            </Text>
            <Switch
              onChange={(event) => setIsDark(!event.target.checked)}
              color="error"
              checked={true}
              size="sm"
              iconOn={<BiSun />}
              iconOff={<BiMoon />}
            />
          </Row>
        </Card.Header>
        <Divider />
        <Card.Body css={{ py: '$12' }}>
          <Spacer y={0.5} />
          <Input size="md" clearable underlined labelPlaceholder="Title" />
          <Spacer y={1.5} />
          <Textarea underlined labelPlaceholder="Description" />
          <Spacer y={1.5} />
          <Input clearable underlined type="file" />
        </Card.Body>
        <Divider />
        <Card.Footer>
          <Row justify="flex-end">
            <Button
              onClick={connectWallet}
              auto
              color="error"
              iconRight={<Send set="bulk" />}
            >
              NFToupon
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
