import { Page } from "puppeteer";
import { createExtractWithSelector } from "../extractWithSelector";

const JSONLD = 'script[type="application/ld+json"]';
const SELECTOR_HEADER_NAME = "#sls-location-details-container  h1";
const SELECTOR_BUSINESS_DETAILS =
  "#sls-location-details-container > div > div > div > h2";

export async function getStoreInfoTelus(page: Page) {
  const extractWithSelector = createExtractWithSelector(page);
  const {
    name,
    address,
    openingHoursSpecification,
    telephone,
    geo,
    branchCode,
  } = JSON.parse(await extractWithSelector(JSONLD));

  const detailsElHandle = await page.$(SELECTOR_BUSINESS_DETAILS);
  let details = null;
  try {
    details = await page.evaluate(
      (el) => el.parentElement.innerText.split("\n"),
      detailsElHandle
    );
  } catch {}

  return {
    headerName: await extractWithSelector(SELECTOR_HEADER_NAME),
    name,
    address,
    openingHoursSpecification,
    telephone,
    geo,
    branchCode,
    details,
  };
}
