import puppeteer from "puppeteer";
import { createLogger } from "./scraper/createLogger";
import { jobs } from "./jobs";
import { prepareWorkerCTX, worker } from "./scraper/worker";

async function main() {
  console.log("launching puppeteer...");
  const browser = await puppeteer.launch({
    headless: false,
  });

  const mainCtx = {
    browser,
    taskCount: 0,
    taskTotal: 0,
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
    const workerCtx = await prepareWorkerCTX(job, mainCtx);
    mainCtx.addTasks(workerCtx.urls.length);
    waitGroup.push(worker(workerCtx).then(() => workerCtx.page.close()));
  }

  await Promise.all(waitGroup);

  await browser.close();
}

if (require.main === module) main();
