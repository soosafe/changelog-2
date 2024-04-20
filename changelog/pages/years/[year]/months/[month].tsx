import { IPageProps } from "pages";
import React from "react";
import dayjs from "dayjs";
import { MainLayout } from "components/layout/main-layout";
import { ChangelogLayout } from "components/changelog-layout";
import { useColorModeValue } from "@chakra-ui/react";
import api from "lib/api/fetch";

const Page = ({ changelogs }: IPageProps) => {
  React.useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const targetElementId = hash.slice(hash.indexOf("#") + 1);
      console.log(">>>:", targetElementId, changelogs[0]);
      if (
        targetElementId ===
        // first element in the list
        changelogs[0]
      ) {
        return;
      }

      setTimeout(() => {
        const element = document.getElementById(targetElementId);
        const firstElement = document.querySelector(".timeline-item");

        if (element === firstElement) {
          return;
        }

        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 120;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 1000);
    }
  }, []);

  return (
    <MainLayout mode={useColorModeValue("light", "dark")} infiniteScrollingView="month">
      {changelogs?.map((changelog, index) => (
        <ChangelogLayout
          key={index}
          index={index}
          hideLayout={true}
          hideHead={true}
          hideAuthors={true}
          isInfiniteScrollingView={true}
          {...changelog}
        />
      ))}
    </MainLayout>
  );
};

// export async function getStaticPaths() {
//   const currentYear = new Date().getFullYear();
//   const years = Array.from(Array(41), (x, i) => currentYear - 20 + i); // Generate paths for 20 years back and forth from the current year
//   const months = Array.from(Array(12)).map((month, index) =>
//     index < 9 ? `0${index + 1}` : `${index + 1}`
//   );
//
//   const paths = months
//     .map((month) =>
//       years.map((year) => ({
//         params: {
//           month: month.toString(),
//           year: year.toString(),
//         },
//       }))
//     )
//     .flat();
//
//   return {
//     paths,
//     fallback: false,
//   };
// }

export const getServerSideProps = async ({ params }) => {
  const changelogs = await api.get("/api/changelogs");

  const { month, year } = params;

  const meta = changelogs.data?.docs
    ?.map((changelog) => changelog)
    .filter((item) => {
      const publishedAt = dayjs(item.publishedAt);

      return item && publishedAt.format("YYYY") === year && publishedAt.format("MM") === month;
    });

  meta.sort((a, b) => {
    const dateB = new Date(b.publishedAt);
    const dateA = new Date(a.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  const recents = meta.map((item) => item);

  return {
    props: {
      changelogs: recents,
      totalItems: {
        weeks: changelogs.data.docs.length,
      },
    },
    revalidate: 1,
  };
};

export default Page;
