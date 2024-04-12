import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { defaultPx } from "lib/utils/default-container-px";
import { Box, Container, Flex, Heading, HStack, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { NavbarMobileMenuProps } from "./navbar-mobile-menu";
import { DesktopNavItem } from "./desktop-nav-item";
import { NextResponsiveImage } from "../next-responsive-image";
import { ToggleTheme } from "components/layout/toggle-theme";
import api from "lib/api/fetch";

const DynamicNavbarMobileMenu = dynamic<NavbarMobileMenuProps>(
  () => import("./navbar-mobile-menu").then((mod) => mod.NavbarMobileMenu),
  { ssr: false }
);

interface NavbarProps {
  mode?: "light" | "dark";
}

function Navbar(props: NavbarProps) {
  // const { loggedIn } = useAuth();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } = useDisclosure();

  const [headerNav, setHeaderNav] = useState<
    { link: { type: "custom"; newTab: boolean; url: string; label: string }; id: string }[]
  >([]);
  const [setting, setSetting] = useState<{ logo: { url: string }; title: string } | null>(null);

  const [showLogoMenu, setShowLogoMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerResponse = await api.get("/api/globals/header?draft=false&depth=1");
        setHeaderNav(headerResponse?.data?.navItems);

        const settingResponse = await api.get("/api/globals/setting?draft=false&depth=1");
        setSetting(settingResponse?.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Mobile navbar */}
      {isMobileMenuOpen ? (
        // @ts-ignore
        <DynamicNavbarMobileMenu mode={props.mode} toggle={onMobileMenuToggle} />
      ) : (
        <Box
          w="100%"
          zIndex="overlay"
          display={["block", "block", "block", "none"]}
          position="relative"
        >
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Flex p={4} as="a" href="/">
                {setting?.logo?.url ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${setting?.logo?.url}`}
                    alt={process.env.NEXT_PUBLIC_SITE_TITLE}
                    style={{ width: "100%", height: "32px" }}
                  />
                ) : (
                  <Heading as="h1">{process.env.NEXT_PUBLIC_SITE_TITLE}</Heading>
                )}
              </Flex>
              <Flex p={4} onClick={onMobileMenuToggle}>
                <Box>
                  <HamburgerIcon
                    boxSize={7}
                    color={props.mode === "dark" ? "white" : "landing.almostBlack.500"}
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      )}
      <Container
        position="relative"
        maxW="landingMax"
        zIndex={15}
        overflowX="hidden"
        display={["none", "none", "none", "block"]}
        px={defaultPx("120px")}
        my={[6]}
        top={0}
      >
        <Flex direction="row" alignItems="center" justify="space-between">
          {/* Logo */}
          <Box
            onContextMenu={(e) => {
              e.preventDefault();
              setShowLogoMenu(!showLogoMenu);
            }}
          >
            <Link href="/" passHref prefetch={false}>
              {setting?.logo?.url ? (
                <NextResponsiveImage
                  display={["none", "none", "block"]}
                  src={`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${setting?.logo?.url}`}
                  alt={process.env.NEXT_PUBLIC_SITE_TITLE}
                  width={["100px"]}
                  height={["32px"]}
                  cursor="pointer"
                  {...(props.mode === "dark" && {
                    filter: "invert(1) brightness(10000%)",
                  })}
                />
              ) : (
                <Heading as="h1">{process.env.NEXT_PUBLIC_SITE_TITLE}</Heading>
              )}
            </Link>
          </Box>
          {/* Navigation items */}
          <HStack spacing={[0, 0, 4, 12, 20]} align="center">
            {/* Rest of routes */}
            {headerNav?.map((nav) => (
              <DesktopNavItem
                key={nav.id}
                mode={props.mode}
                link={nav.link.url}
                title={nav.link.label}
                type="external-link"
              />
            ))}
          </HStack>
          {/* CTAs */}
          <HStack spacing={4} align="center">
            <ToggleTheme />
          </HStack>
        </Flex>
      </Container>
    </>
  );
}

export default Navbar;
