import { Page } from "puppeteer";

/*Gets First Contentful-Paint metric*/
function getFcp(entries: PerformanceEntry[]) {
  const fcpEvent = entries.find((x) => x.name === "first-contentful-paint");
  return fcpEvent?.startTime ?? 0;
}

/*Gets Time To First Byte metric*/
function getTTFB(entries: PerformanceEntry[]) {
  const navigationEvent = entries.find((x) => x.entryType === "navigation") as PerformanceNavigationTiming;
  return navigationEvent.responseStart ?? 0;
}

/*Gets performance metrics*/
export async function getPerformanceEntries(page: Page) {
  const rawPerfEntries = await page.evaluate(function () {
    return JSON.stringify(window.performance.getEntries());
  });

  const allPerformanceEntries = JSON.parse(rawPerfEntries);

  return {
    fcp: getFcp(allPerformanceEntries),
    ttfb: getTTFB(allPerformanceEntries),
  };
}