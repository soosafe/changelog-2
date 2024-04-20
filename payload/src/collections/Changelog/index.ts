import { slateEditor } from "@payloadcms/richtext-slate";
import payload from "payload";
import type { CollectionConfig } from "payload/types";

import { admins } from "../../access/admins";
import { adminsOrPublished } from "../../access/adminsOrPublished";
import { slugField } from "../../fields/slug";
import { populatePublishedAt } from "../../hooks/populatePublishedAt";
import { populateAuthors } from "./hooks/populateAuthors";
import { revalidateChangelog } from "./hooks/revalidateChangelog";

const Changelogs: CollectionConfig = {
  slug: "changelogs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateChangelog],
    afterRead: [populateAuthors],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: slateEditor({
        admin: {
          elements: ["blockquote", "h1", "h2", "ol", "ul", "link"],
          leaves: ["bold", "italic", "underline"],
        },
      }),
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "authors",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: "populatedAuthors",
      type: "array",
      admin: {
        readOnly: true,
        disabled: true,
      },
      access: {
        update: () => false,
      },
      fields: [
        {
          name: "id",
          type: "text",
        },
        {
          name: "name",
          type: "text",
        },
      ],
    },
    slugField(),
  ],
  endpoints: [
    {
      path: "/slug/:slug",
      method: "get",
      handler: async (req, res, next) => {
        const data = await payload.find({
          collection: "changelogs",
          where: { slug: { equals: req.params.slug } },
          // limit: 1,
        });
        if (data.docs.length === 0) {
          res.status(404).send({ error: "not found" });
        } else {
          res.status(200).send(data.docs[0]);
        }
      },
    },
  ],
};

export default Changelogs;
