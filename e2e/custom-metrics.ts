import { Page } from "puppeteer";

function getAppRendered(entries: PerformanceEntry[]) {
  const appRenderedEvent = entries.find((x) => x.name === "app-rendered");
  return appRenderedEvent?.startTime ?? 0;
}

export async function getCustomMetrics(page: Page) {
  const rawEntries = await page.evaluate(function () {
    return JSON.stringify(window.performance.getEntries());
  });

  const entries = JSON.parse(rawEntries);

  return {
    appRendered: getAppRendered(entries),
  };
}
