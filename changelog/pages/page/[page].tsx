// import api from "lib/api/fetch";
import { getServerSideProps as getServerSidePropsForIndexPage } from "pages";
import IndexPage from "../index";

// const ITEMS_PER_PAGE = 4;

const Page = IndexPage;

// export async function getStaticPaths() {
//   const changelogs = await api.get("/api/changelogs");
//   const changelogsLength = Math.floor(changelogs?.data?.totalPages / ITEMS_PER_PAGE);
//   const numbers = Array.from(Array(changelogsLength), (x, i) => i);
//
//   return {
//     paths: numbers.map((number) => ({
//       params: {
//         page: number.toString(),
//       },
//     })),
//     fallback: false,
//   };
// }

export const getServerSideProps = getServerSidePropsForIndexPage;

export default Page;
