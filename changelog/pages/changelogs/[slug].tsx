import React from "react";
import api from "lib/api/fetch";
import { ChangelogLayout } from "components/changelog-layout";

const Changelog = ({ changelog }) => {
  return (
    <div>
      <ChangelogLayout
        hideLayout={false}
        hideHead={false}
        hideAuthors={false}
        isInfiniteScrollingView={false}
        {...changelog}
      />
    </div>
  );
};

export async function getStaticPaths() {
  const changelogs = await api.get("/api/changelogs");

  return {
    paths: changelogs.data.docs.map((changelog) => ({
      params: {
        slug: changelog.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const changelogResponse = await api.get(`/api/changelogs/slug/${params.slug}`);
  const changelog = changelogResponse?.data;

  return {
    props: {
      changelog,
    },
    revalidate: 1,
  };
}

export default Changelog;
