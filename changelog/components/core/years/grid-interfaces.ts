import { IChangelogPreviewMeta } from "lib/models/view";

export interface IGridProps {
  changelogs: IChangelogPreviewMeta[];
  isFirstItem?: boolean; // used for animating the first item
}
