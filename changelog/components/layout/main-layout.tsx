import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { defaultPx } from "lib/utils/default-container-px";
import TryBanner from "components/core/try-banner";
import Navbar from "components/core/navbar";
import { Footer } from "components/core/footer";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import TimeSelectionTabs from "../core/time-selection-tabs";
import useTimelineStore from "lib/state/use-timeline-store";
import { motion } from "framer-motion";
import useAnimatePageStore from "lib/state/use-animate-page-store";
import { useRouter } from "next/router";
import usePageStatusStore from "lib/state/use-page-status-store";
import CTASection from "components/cta/cta-section";

export interface MainLayoutProps {
  page?: number;
  children: ReactNode;
  itemsPerPage?: number;
  totalItems?: {
    weeks: number;
    months: number;
    years: number;
  };
  infiniteScrollingView?: "year" | "month";
  mode?: "light" | "dark";
}

export const MainLayout = ({
  page,
  mode,
  children,
  itemsPerPage,
  totalItems,
  infiniteScrollingView,
}: MainLayoutProps) => {
  const metaTitle = `${infiniteScrollingView ? "" : page > 0 ? `Page ${page} -` : ""} ${
    process.env.NEXT_PUBLIC_SITE_TITLE
  }`;
  const timeline = useTimelineStore();
  const { animatePage, setAnimatePage } = useAnimatePageStore();
  const router = useRouter();
  const pageStatus = usePageStatusStore();

  React.useEffect(() => {
    const hash = window?.location.hash ?? "";

    timeline.setView(
      hash ? (hash === "#months" ? "months" : hash === "#years" ? "years" : "weeks") : "weeks"
    );
  }, []);

  React.useEffect(() => {
    router.events.on("routeChangeStart", (url: string) => {
      if (!url.includes("/changelogs/")) {
        window.scrollTo({
          top: 0,
        });
      }

      pageStatus.setIsLoading(true);

      if (url.includes("/years") && !url.includes("/months")) {
        timeline.setView("months");
      } else if (url.includes("/years") && url.includes("/months")) {
        timeline.setView("weeks");
      }
    });

    router.events.on("routeChangeComplete", (url: string) => {
      pageStatus.setIsLoading(false);

      if (url.includes("/years") && !url.includes("/months")) {
        timeline.setView("months");
      } else if (url.includes("/years") && url.includes("/months")) {
        timeline.setView("weeks");
      }
    });
  }, []);

  const hasMorePage =
    !infiniteScrollingView &&
    page !== undefined &&
    page < Math.floor(totalItems[timeline.view] / itemsPerPage);

  const isInBlogPage = router.pathname.startsWith("/changelogs/");

  return (
    <>
      {!isInBlogPage && (
        <Head>
          <title>{metaTitle}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="title" content={metaTitle} />
          <meta name="description" content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION} />
          <meta name="image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/social.png`} />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
          <meta property="og:description" content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/social.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
          <meta name="twitter:title" content={metaTitle} />
          <meta name="twitter:description" content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION} />
          <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/social.png`} />
        </Head>
      )}
      <motion.div
        initial={animatePage ? "hidden" : "visible"}
        animate="visible"
        onAnimationComplete={() => {
          setAnimatePage(false);
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
        >
          <Navbar mode={useColorModeValue("light", "dark")} />
        </motion.div>
        {!isInBlogPage && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
            }}
            layout
            layoutId="timeline-switcher-button"
            transition={{ duration: 0 }}
            style={{
              position: "sticky",
              top: "32px",
              zIndex: 1,
              paddingBottom: "32px",
            }}
          >
            <TimeSelectionTabs />
          </motion.div>
        )}
        <Box w="100vw" maxW={"100%"} zIndex="docked">
          <Container maxW="landingMax" display="flex" justifyContent="center" px={defaultPx(32)}>
            <VStack spacing={8} alignItems="center" w="full">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
                }}
              >
                <VStack
                  display="flex"
                  justifyContent="start"
                  alignItems="start"
                  gap={[8, 8, 14]}
                  minWidth={["100%", "100%", "834px"]}
                  minHeight="100vh"
                >
                  {!isInBlogPage && (
                    <VStack alignItems="start" width="100%">
                      <Text
                        fontSize="xl"
                        color={mode === "dark" ? "white" : "gray.700"}
                        textAlign={"start"}
                      >
                        The latest from June
                      </Text>
                      <Heading
                        as="h1"
                        fontSize={["5xl"]}
                        color={mode === "dark" ? "white" : "black"}
                        textAlign={"start"}
                      >
                        Changelog
                      </Heading>
                    </VStack>
                  )}
                  <VStack spacing={0} justifyContent="center">
                    {children}
                  </VStack>
                </VStack>
              </motion.div>
              <motion.div
                hidden={!!infiniteScrollingView}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } },
                }}
              >
                <VStack align={["stretch", "stretch", "center"]}>
                  {page === 0 && hasMorePage ? (
                    <Link href={`/page/1#${timeline.view}`}>
                      <Button variant="landingOutline" size="landingLg">
                        Load more
                      </Button>
                    </Link>
                  ) : (
                    <HStack justifyContent="center" spacing={4}>
                      {page > 0 && (
                        <Link href={`/page/${page - 1}${"#" + timeline.view}`}>
                          <Button variant="landingOutline" size="landingLg">
                            Previous page
                          </Button>
                        </Link>
                      )}
                      {hasMorePage && (
                        <Link href={`/page/${page + 1}${"#" + timeline.view}`}>
                          <Button variant="landingOutline" size="landingLg">
                            Next page
                          </Button>
                        </Link>
                      )}
                    </HStack>
                  )}
                </VStack>
              </motion.div>
            </VStack>
          </Container>
        </Box>
      </motion.div>
      <motion.div
        className="HOMEPAGE"
        initial={{ opacity: animatePage ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <CTASection />
      </motion.div>
    </>
  );
};
