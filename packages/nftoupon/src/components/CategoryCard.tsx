import * as React from "react";
import {
  AspectRatio,
  Box,
  BoxProps,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";

type Category = {
  id: string;
  imageUrl: string;
  description: string;
  offer: string;
};

interface Props {
  category: Category;
  rootProps?: BoxProps;
}

export const CategoryCard = (props: Props) => {
  const { category, rootProps } = props;
  return (
    <Box
      position="relative"
      key={category.description}
      borderRadius="xl"
      overflow="hidden"
      {...rootProps}
    >
      <AspectRatio ratio={1 / 1}>
        <Image
          src={category.imageUrl}
          alt={category.description}
          fallback={<Skeleton />}
        />
      </AspectRatio>
      <Box
        position="absolute"
        inset="0"
        bgGradient="linear(to-b, transparent 60%, gray.900)"
        boxSize="full"
      />
      <Box position="absolute" bottom="6" width="full" textAlign="left" px={3}>
        <Text color="white" fontSize="sm" fontWeight="semibold">
          {category.description}
        </Text>
      </Box>
    </Box>
  );
};
