import { Browser } from "puppeteer";
import fs from "fs";
import { jobs } from "../jobs";
import { sitemapToURLs } from "./sitemapToURLs";
import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import { createLogger } from "./createLogger";

const DELAY = 1000;

interface MainCtx {
  browser: Browser;
  taskCount: number;
  taskTotal: number;
  log: ReturnType<typeof createLogger>;
  increment: () => void;
  addTasks: (total: number) => void;
  logProgress: () => void;
}

export async function prepareWorkerCTX(
  job: typeof jobs[number],
  mainCtx: MainCtx
) {
  const { name, sitemapPath, targetPath, getStoreInfo } = job;
  const sitemapRaw = fs.readFileSync(sitemapPath, "utf8");
  const urls = sitemapToURLs(sitemapRaw);
  const page = await mainCtx.browser.newPage();
  const db = await (await low(new FileAsync(targetPath))).read();
  const log = createLogger(name);

  return {
    name,
    sitemapPath,
    targetPath,
    getStoreInfo,
    urls,
    page,
    db,
    log,
    main: mainCtx,
  };
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type CTX = ThenArg<ReturnType<typeof prepareWorkerCTX>>;

export async function worker(ctx: CTX) {
  ctx.log(`processing ${ctx.urls.length} urls`);

  let i = 0;
  for (const url of ctx.urls) {
    i++;
    ctx.main.increment();
    ctx.main.logProgress();
    ctx.log(`url ${i} of ${ctx.urls.length}`, url);
    const dbId = url.replace(/\./g, "_");
    const seen = await ctx.db.has(dbId).value();
    if (seen) {
      continue;
    }
    await Promise.all([
      ctx.page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
      ctx.page.goto(url),
    ]);

    try {
      const storeData = await ctx.getStoreInfo(ctx.page);
      const data = {
        url,
        store: storeData,
      };

      await ctx.db.set(dbId, data).write();
    } catch (err) {
      ctx.log("error", url);
      console.error(url, err);
    }

    // @ts-ignore
    await ctx.page.waitForTimeout(DELAY);
  }
}
