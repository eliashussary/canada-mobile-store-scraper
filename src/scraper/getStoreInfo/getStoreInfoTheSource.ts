import { Page } from "puppeteer";
import { createExtractWithSelector } from "../extractWithSelector";
import { jsonParse } from "../jsonParse";

export async function getStoreInfoTheSource(page: Page) {
  const extractWithSelector = createExtractWithSelector(page);
  return {
    name: await extractWithSelector(".store-name"),
    address: (await extractWithSelector(".address")).split("\n"),
    phone: await extractWithSelector(".tel-link"),
    geo: jsonParse(await extractWithSelector("#map_canvas", "data-stores")),
    hours: (
      await extractWithSelector(
        "div.store-info-section.hours > div.store-info-value"
      )
    ).split("\n"),
  };
}
