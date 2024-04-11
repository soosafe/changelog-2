import { ChangelogLayout, ChangelogLayoutProps } from "components/changelog-layout";
import React from "react";

interface IWeeksProps {
  changelogs: ChangelogLayoutProps[];
  isInfiniteScrollingView?: boolean;
}

const Weeks = ({ changelogs, isInfiniteScrollingView }: IWeeksProps) => {
  return (
    <>
      {changelogs.map((changelog, index) => (
        <ChangelogLayout
          key={index}
          index={index}
          hideLayout={true}
          hideHead={true}
          hideAuthors={true}
          isInfiniteScrollingView={isInfiniteScrollingView}
          {...changelog}
        />
      ))}
    </>
  );
};

export default Weeks;
