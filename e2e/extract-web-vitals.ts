import { Page } from "puppeteer";

function extractMetrics() {
  function extractLCP(entries: PerformanceEntry[]) {
    const allLcp = entries.filter((x) => x.entryType === "largest-contentful-paint");
    return allLcp.length > 0 ? allLcp[allLcp.length - 1].startTime : 0;
  }

  const safeParser = (key: string, val: any) => (key === "element" ? null : val);

  const lcp = extractLCP(window._pe);

  return { lcp: JSON.stringify(lcp, safeParser) };
}

export async function extractWebVitals(page: Page) {
  return await page.evaluate(extractMetrics);
}
