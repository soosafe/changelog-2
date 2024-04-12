import React from "react";
import NextLink from "next/link";
import { Container } from "@chakra-ui/react";
import { PageSectionProps } from "lib/models/page-section-props";

interface TryJuneBannerProps extends PageSectionProps {
  subheading?: string;
  heading?: string | React.ReactNode;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonHrefType?: "external" | "internal";
  mode?: "light" | "dark";
}

function TryJuneBanner(props: TryJuneBannerProps) {
  return (
    <Container maxW="landingMax" px={[0, 0, 12, 12, 40]} {...props._wrapper}>
      <NextLink href="https://365devlab.com/login">
        <img
          style={{ width: "100%", maxHeight: "auto", borderRadius: "15px", cursor: "pointer" }}
          src="/banner.png"
          alt="banner"
        />
      </NextLink>
    </Container>
  );
}

export default TryJuneBanner;
