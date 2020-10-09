import { Page } from "puppeteer";

export async function getStoreInfoWalmart(page: Page) {
  // @ts-ignore
  const data = await page.evaluate(() => {
    // @ts-ignore
    console.log(window.INITIAL_STATE);
    // @ts-ignore
    return JSON.stringify(window.INITIAL_STATE);
  });

  const jsonData = JSON.parse(data);

  const { storeDetails } = jsonData;

  const hasWireless = storeDetails.store.servicesMap.some(
    (s: any) => s?.service?.name === "WALMART_WIRELESS" && s?.active
  );

  return {
    ...storeDetails,
    hasWireless,
  };
}
