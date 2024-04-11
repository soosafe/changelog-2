export interface IChangelogPreviewMeta {
  title: string;
  publishedAt: string;
  slug: string;
  image: {
    url: string;
  };
  authors: {
    id: string;
    name: string;
    avatar: { url: string };
  }[];
  meta: {
    title: string;
    description: string;
    image: {
      url: string;
    };
  };
}

export interface IYearlyChangelog {
  changelogs: IChangelogPreviewMeta[];
}

export interface IAggregatedChangelogs {
  [key: string]: IChangelogPreviewMeta[];
}
