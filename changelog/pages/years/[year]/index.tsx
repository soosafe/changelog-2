import Months from "components/layout/months";
import { IAggregatedChangelogs, IChangelogPreviewMeta } from "lib/models/view";
import { IPageProps } from "pages";
import React, { useEffect, useState } from "react";
import { MainLayout } from "components/layout/main-layout";
import { useColorModeValue } from "@chakra-ui/react";
import api from "lib/api/fetch";

const ITEMS_PER_PAGE = 4;
const MONTHS_PER_RENDER = 12;

const Page = ({ changelogsMap }: IPageProps) => {
  const [renderedMonths, setRenderedMonths] = useState(0);

  useEffect(() => {
    setRenderedMonths((prevRenderedMonths) => prevRenderedMonths + MONTHS_PER_RENDER);
  }, []);

  const monthsToRender = Object.entries(changelogsMap.months)
    .slice(0, renderedMonths)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  React.useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const targetElementId = hash.slice(hash.indexOf("#") + 1);

      setTimeout(() => {
        const element = document.getElementById(targetElementId);
        const firstElement = document.querySelector(".timeline-item");

        if (element === firstElement) {
          return;
        }

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1000);
    }
  }, []);

  return (
    <MainLayout mode={useColorModeValue("light", "dark")} infiniteScrollingView="year">
      <Months monthChangelogsMap={monthsToRender} isInfiniteScrollingView />
    </MainLayout>
  );
};

// export async function getStaticPaths() {
//   const currentYear = new Date().getFullYear();
//   const years = Array.from(Array(41), (x, i) => currentYear - 20 + i); // Generate paths for 20 years back and forth from the current year
//
//   const paths = years.map((year) => ({
//     params: {
//       year: year.toString(),
//     },
//   }));
//
//   return {
//     paths,
//     fallback: false,
//   };
// }

export const getServerSideProps = async ({ params }) => {
  const changelogs = await api.get("/api/changelogs");

  const meta = changelogs.data?.docs?.map((changelog) => changelog).filter((item) => item);

  meta.sort((a, b) => {
    const dateB = new Date(b.publishedAt);
    const dateA = new Date(a.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  const recents = meta.map((item) => item.slug);

  // aggregate images for monthly changelogs
  const monthChangelogsMap: IAggregatedChangelogs = meta.reduce((acc, item, index) => {
    const date = new Date(item.publishedAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month}`;

    if (year.toString() !== params.year) return acc;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      mediaUrl: item.media.url,
      slug: item.slug,
      publishedAt: item.publishedAt,
      weeklyViewPage: Math.floor(index / ITEMS_PER_PAGE),
    } as IChangelogPreviewMeta);
    return acc;
  }, {});

  const recentMonthChangelogsMap: IAggregatedChangelogs = Object.keys(monthChangelogsMap).reduce(
    (acc, key) => {
      acc[key] = monthChangelogsMap[key];
      return acc;
    },
    {}
  );

  return {
    props: {
      slugs: recents,
      changelogsMap: { months: recentMonthChangelogsMap },
      totalItems: {
        weeks: changelogs.data.docs.length,
        months: Object.keys(monthChangelogsMap).length,
      },
    },
    revalidate: 1,
  };
};

export default Page;
