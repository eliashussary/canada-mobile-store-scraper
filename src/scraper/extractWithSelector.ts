import { Page } from "puppeteer";

export function createExtractWithSelector(page: Page) {
  return async function extractWithSelector(
    selector: string,
    attr?: string
  ): Promise<string> {
    const elHandle = await page.$(selector);
    if (!elHandle) {
      return "";
    }

    if (attr) {
      const data = await page.evaluate(
        (el, attr) => el.getAttribute(attr),
        elHandle,
        attr
      );
      if (data) {
        return data;
      }
    }

    const data = (await (
      await elHandle.getProperty("innerText")
    ).jsonValue()) as string;

    return data;
  };
}
