import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { defaultPx } from "lib/utils/default-container-px";
import {
  Box,
  chakra,
  Container,
  ContainerProps,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FooterTitle } from "./footer-title";
import { FooterLink } from "./footer-link";
import api from "lib/api/fetch";

const LINK_GAPS = [2, 2, 8];

interface FooterProps {
  _wrapper?: ContainerProps;
  mode?: "light" | "dark";
}

export function Footer(props: FooterProps) {
  const [setting, setSetting] = useState<{ footer_logo: { url: string } } | null>(null);
  const [footerNav, setFooterNav] = useState<
    {
      link: { type: "custom"; newTab: boolean; url: string; label: string; section: string };
      id: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerResponse = await api.get("/api/globals/footer?draft=false&depth=1");
        setFooterNav(headerResponse?.data?.navItems);

        const settingResponse = await api.get("/api/globals/setting?draft=false&depth=1");
        setSetting(settingResponse?.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxW="landingMax" px={defaultPx(32)} {...props._wrapper}>
      <Grid
        gap={[6, 6, 4]}
        templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(5, 1fr)"]}
        gridTemplateAreas={[
          "'logo logo' 'solution for' 'company legal'",
          "'logo logo' 'solution for' 'company legal'",
          "'logo solution for company legal'",
        ]}
      >
        <GridItem gridArea="logo">
          <Box flexShrink={0} mb={8}>
            {setting?.footer_logo?.url ? (
              <img
                src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${setting?.footer_logo?.url}`}
                alt={process.env.NEXT_PUBLIC_SITE_TITLE}
                style={{ width: "56px", height: "56px" }}
              />
            ) : (
              <Heading as="h1">{process.env.NEXT_PUBLIC_SITE_TITLE}</Heading>
            )}
          </Box>
          <FooterLink
            mode={props.mode}
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/security`}
            title={
              <HStack cursor={"pointer"}>
                <Image src="/soc2type2.svg" alt="SOC 2 Type II" />
                <Text color={props.mode === "dark" ? "gray.600" : "landing.gray"}>
                  SOC 2 Type II
                </Text>
              </HStack>
            }
          />
          <FooterLink
            mode={props.mode}
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/security`}
            title={
              <HStack cursor={"pointer"}>
                <Flex h="32px" w="32px" justify={"center"} align="center">
                  <Image h={"24px"} w={"24px"} src="/gdrp.svg" alt="GDPR" />
                </Flex>
                <Text color={props.mode === "dark" ? "gray.600" : "landing.gray"}>GDPR Ready</Text>
              </HStack>
            }
          />
        </GridItem>
        <GridItem gridArea="solution">
          <VStack align="start" spacing={LINK_GAPS}>
            <FooterTitle mode={props.mode}>Solutions</FooterTitle>
            {footerNav.map(
              (item) =>
                item.link.section === "Solutions" && (
                  <FooterLink mode={props.mode} title={item.link.label} href={item.link.url} />
                )
            )}
          </VStack>
        </GridItem>
        <GridItem gridArea="for">
          <VStack align="start" spacing={LINK_GAPS}>
            <FooterTitle mode={props.mode}>Resources</FooterTitle>
            {footerNav.map(
              (item) =>
                item.link.section === "Resources" && (
                  <FooterLink mode={props.mode} title={item.link.label} href={item.link.url} />
                )
            )}
          </VStack>
        </GridItem>
        <GridItem gridArea="company">
          <VStack align="start" spacing={LINK_GAPS}>
            <FooterTitle mode={props.mode}>Company</FooterTitle>
            {footerNav.map(
              (item) =>
                item.link.section === "Company" && (
                  <FooterLink mode={props.mode} title={item.link.label} href={item.link.url} />
                )
            )}
          </VStack>
        </GridItem>
        <GridItem gridArea="legal">
          <VStack align="start" spacing={LINK_GAPS}>
            <FooterTitle mode={props.mode}>Legal</FooterTitle>
            {footerNav.map(
              (item) =>
                item.link.section === "Legal" && (
                  <FooterLink mode={props.mode} title={item.link.label} href={item.link.url} />
                )
            )}
            <FooterLink
              mode={props.mode}
              title={`Copyright © ${new Date().getFullYear().toString()} ${
                process.env.NEXT_PUBLIC_SITE_TITLE
              }`}
              type="text"
            />
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}
