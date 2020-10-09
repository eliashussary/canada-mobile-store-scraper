import path from "path";

import {
  getStoreInfoBell,
  getStoreInfoRogersFido,
  getStoreInfoTelus,
  getStoreInfoTheSource,
  getStoreInfoWalmart,
} from "./scraper/getStoreInfo";

const resolve = (pth: string) => path.resolve(__dirname, pth);

export const jobs = [
  // {
  //   name: "bell",
  //   sitemapPath: resolve("../data/sitemaps/bell_store_sitemap.xml"),
  //   targetPath: resolve("../data/json/bell_stores.json"),
  //   getStoreInfo: getStoreInfoBell,
  // },
  {
    name: "rogers",
    sitemapPath: resolve("../data/sitemaps/rogers_store_sitemap.xml"),
    targetPath: resolve("../data/json/rogers_stores.json"),
    getStoreInfo: getStoreInfoRogersFido,
  },
  {
    name: "fido",
    sitemapPath: resolve("../data/sitemaps/fido_store_sitemap.xml"),
    targetPath: resolve("../data/json/fido_stores.json"),
    getStoreInfo: getStoreInfoRogersFido,
  },
  {
    name: "telus",
    sitemapPath: resolve("../data/sitemaps/telus_store_sitemap.xml"),
    targetPath: resolve("../data/json/telus_stores.json"),
    getStoreInfo: getStoreInfoTelus,
  },
  {
    name: "thesource",
    sitemapPath: resolve("../data/sitemaps/thesource_store_sitemap.xml"),
    targetPath: resolve("../data/json/thesource_stores.json"),
    getStoreInfo: getStoreInfoTheSource,
  },
  {
    name: "walmart",
    sitemapPath: resolve("../data/sitemaps/walmart_store_sitemap.xml"),
    targetPath: resolve("../data/json/walmart_stores.json"),
    getStoreInfo: getStoreInfoWalmart,
  },
] as const;
