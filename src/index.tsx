import React from 'react';
import {
  NextUIProvider,
  Button,
  Card,
  Divider,
  Input,
  Row,
  Spacer,
  Text,
  Textarea,
  Switch,
  createTheme,
} from '@nextui-org/react';
import { Send } from 'react-iconly';
import { BiSun, BiMoon } from 'react-icons/bi';

const myDarkTheme = createTheme({
  type: 'dark',
});

const lightTheme = createTheme({
  type: 'light',
});

export const Thing = () => {
  const [isDark, setIsDark] = React.useState(false);

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
            <Button auto color="error" iconRight={<Send set="bulk" />}>
              NFToupon
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    </NextUIProvider>
  );
};
