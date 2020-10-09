import { Page } from "puppeteer";
import { createExtractWithSelector } from "../extractWithSelector";

const JSONLD =
  'li.rsx-sl-store-list-store.rsx-active > script[type="application/ld+json"]';

export async function getStoreInfoBell(page: Page) {
  const extractWithSelector = createExtractWithSelector(page);
  const { address, name, openingHours, telephone } = JSON.parse(
    await extractWithSelector(JSONLD)
  );
  return {
    name,
    address,
    hours: openingHours,
    phone: telephone,
    services: (await extractWithSelector("ul.rsx-list")).split("\n"),
  };
}
