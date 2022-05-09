import React, { useState } from "react";
import {
  AspectRatio,
  HStack,
  Image,
  Skeleton,
  StackProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  Carousel,
  CarouselIconButton,
  CarouselSlide,
  useCarousel,
} from "./Carousel";
import { ProductImage } from "../common/data";

interface GalleryProps {
  images: ProductImage[];
  aspectRatio?: number;
  rootProps?: StackProps;
  nftDetailIndex: number;
  setNftDetailIndex: (index: number) => void;
}

export const Gallery = (props: GalleryProps) => {
  const {
    images,
    aspectRatio = 4 / 3,
    nftDetailIndex,
    setNftDetailIndex,
    rootProps,
  } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = useBreakpointValue({ base: 3, md: 5 });

  const [ref, slider] = useCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({ base: 16, md: 24 }),
    },
    slideChanged: (slider: any) => setCurrentSlide(slider.track.details.rel),
  });

  return (
    <HStack spacing="4" py="5" {...rootProps}>
      <CarouselIconButton
        onClick={() => slider.current?.prev()}
        icon={<IoChevronBackOutline />}
        aria-label="Previous slide"
        disabled={currentSlide === 0}
      />
      <Carousel ref={ref} direction="row" width="full">
        {images.map((image, i) => (
          <CarouselSlide
            key={i}
            onClick={() => setNftDetailIndex(i)}
            cursor="pointer"
          >
            <AspectRatio
              ratio={aspectRatio}
              transition="all 200ms"
              opacity={nftDetailIndex === i ? 1 : 0.4}
              _hover={{ opacity: 1 }}
            >
              <Image
                src={image.imageUrl}
                objectFit="cover"
                alt={image.description}
                fallback={<Skeleton />}
              />
            </AspectRatio>
          </CarouselSlide>
        ))}
      </Carousel>
      <CarouselIconButton
        onClick={() => slider.current?.next()}
        icon={<IoChevronForwardOutline />}
        aria-label="Next slide"
        disabled={currentSlide + Number(slidesPerView) === images.length}
      />
    </HStack>
  );
};
