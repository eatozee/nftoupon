import React from "react";
import {
  Container,
  Stack,
  Text,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";

export const Footer = () => (
  <Container as="footer" role="contentinfo" py={5} bgColor="gray.50">
    <Stack justify="space-between" direction="row" align="center">
      <Text fontSize="sm" color="subtle">
        &copy; {new Date().getFullYear()} widget by eatozee
      </Text>
      <ButtonGroup variant="ghost">
        <IconButton
          as="a"
          href="https://discord.gg/5pXbmVDM"
          aria-label="Discord"
          icon={<FaDiscord fontSize="1.25rem" />}
        />
        <IconButton
          as="a"
          href="https://github.com/eatozee"
          aria-label="GitHub"
          icon={<FaGithub fontSize="1.25rem" />}
        />
        <IconButton
          as="a"
          href="https://twitter.com/eatozee"
          aria-label="Twitter"
          icon={<FaTwitter fontSize="1.25rem" />}
        />
      </ButtonGroup>
    </Stack>
  </Container>
);
