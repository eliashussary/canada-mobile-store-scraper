import { Page } from "puppeteer";
import { createExtractWithSelector } from "../extractWithSelector";
import { jsonParse } from "../jsonParse";

const SELECTOR_NAME = ".Core-name";
const SELECTOR_HOURS = ".js-hours-table[data-days]";
const SELECTOR_LATITUDE = `meta[itemprop="latitude"]`;
const SELECTOR_LONGITUDE = `meta[itemprop="longitude"]`;
const SELECTOR_LOCALITY = `meta[itemprop="addressLocality"]`;
const SELECTOR_ADDRESS = `meta[itemprop="streetAddress"]`;
const SELECTOR_POSTALCODE = ".c-address-postal-code";
const SELECTOR_CITY = ".c-address-city";
const SELECTOR_COUNTRY = ".c-address-country-name";
const SELECTOR_INTERSECTION = ".Core-intersection.Core-subtext";
const SELECTOR_PHONE_MAIN = "#phone-main";
const SELECTOR_SERVICES = ".Services-container";

export async function getStoreInfoRogersFido(page: Page) {
  const extractWithSelector = createExtractWithSelector(page);
  const hours = await extractWithSelector(SELECTOR_HOURS, "data-days");
  return {
    name: await extractWithSelector(SELECTOR_NAME),
    hours: jsonParse(hours),
    latitude: await extractWithSelector(SELECTOR_LATITUDE, "content"),
    longitude: await extractWithSelector(SELECTOR_LONGITUDE, "content"),
    locality: await extractWithSelector(SELECTOR_LOCALITY, "content"),
    address: await extractWithSelector(SELECTOR_ADDRESS, "content"),
    postal: await extractWithSelector(SELECTOR_POSTALCODE, "content"),
    city: await extractWithSelector(SELECTOR_CITY),
    country: await extractWithSelector(SELECTOR_COUNTRY),
    intersection: await extractWithSelector(SELECTOR_INTERSECTION),
    phone: await extractWithSelector(SELECTOR_PHONE_MAIN),
    services: (await extractWithSelector(SELECTOR_SERVICES)).split("\n"),
  };
}
