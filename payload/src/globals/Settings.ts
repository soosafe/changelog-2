import type { GlobalConfig } from "payload/types";

const Settings: GlobalConfig = {
  slug: "settings",
  typescript: {
    interface: "Settings",
  },
  graphQL: {
    name: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "projectsPage",
      type: "relationship",
      relationTo: "pages",
      label: "Projects page",
    },
  ],
};

export default Settings;
