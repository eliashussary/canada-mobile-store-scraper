import puppeteer, { Browser } from "puppeteer";
import { createLogger } from "./scraper/createLogger";
import { jobs } from "./jobs";
import { prepareWorkerCTX, worker } from "./scraper/worker";

type ProcessArgs = [string, string, string, number];
const [
  ,
  ,
  jobFilter = "",
  navigationDelay = 1000,
] = process.argv as ProcessArgs;

export interface MainCtx {
  browser: Browser;
  taskCount: number;
  taskTotal: number;
  navigationDelay: number;
  log: ReturnType<typeof createLogger>;
  increment: () => void;
  addTasks: (total: number) => void;
  logProgress: () => void;
}

async function main() {
  console.log("launching puppeteer...");
  const browser = await puppeteer.launch({
    headless: false,
  });

  const mainCtx: MainCtx = {
    browser,
    taskCount: 0,
    taskTotal: 0,
    navigationDelay,
    log: createLogger("main"),
    increment: function () {
      this.taskCount++;
    },
    addTasks: function (total: number) {
      this.taskTotal += total;
    },
    logProgress: function () {
      this.log(`task ${this.taskCount} of ${this.taskTotal}`);
    },
  };

  const waitGroup = [];
  for (const job of jobs) {
    if (jobFilter) {
      if (job.name !== jobFilter) {
        continue;
      }
    }
    const workerCtx = await prepareWorkerCTX(job, mainCtx);
    mainCtx.addTasks(workerCtx.urls.length);
    waitGroup.push(worker(workerCtx).then(() => workerCtx.page.close()));
  }

  await Promise.all(waitGroup);

  await browser.close();
}

if (require.main === module) main();
