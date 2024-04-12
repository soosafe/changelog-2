import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";

import seo from "@payloadcms/plugin-seo";
import type { GenerateTitle } from "@payloadcms/plugin-seo/types";
import redirects from "@payloadcms/plugin-redirects";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Changelogs from "./collections/Changelog";
import Media from "./collections/Media";
import BeforeLogin from "./components/BeforeLogin";
import BeforeDashboard from "./components/BeforeDashboard";
import Header from "./globals/Header";
import Footer from "./globals/Footer";
import { Setting } from "./globals/Setting";

const generateTitle: GenerateTitle = () => {
  return "Payload";
};

export default buildConfig({
  express: {
    postMiddleware: [
      (_req, res, next) => {
        const existingHeaders = res.getHeader("Access-Control-Allow-Headers");
        res.header(
          "Access-Control-Allow-Headers",
          existingHeaders + ", x-custom-header"
        );
        next();
      },
    ],
  },
  cors: "*",
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: [BeforeLogin],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: [BeforeDashboard],
    },
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          dotenv: path.resolve(__dirname, "./dotenv.js"),
          [path.resolve(__dirname, "./endpoints/seed")]: path.resolve(
            __dirname,
            "./emptyModuleMock.js"
          ),
        },
      },
    }),
  },
  editor: slateEditor({}),
  collections: [Users, Changelogs, Media],
  globals: [Header, Footer, Setting],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [
    redirects({
      collections: ["changelogs"],
    }),
    seo({
      collections: ["changelogs"],
      generateTitle,
      uploadsCollection: "media",
    }),
    payloadCloud(),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
