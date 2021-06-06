import { Page } from "puppeteer";

export async function extractCoreWebVitals(page: Page) {
  const rawMetrics = await page.evaluate(function () {
    return JSON.stringify(window._cwv);
  });

  const metrics: { name: string; value: number }[] = JSON.parse(rawMetrics);

  const formattedMetrics = metrics.reduce(
    (result, entry) => ((result[entry.name] = entry.value), result),
    {} as Record<string, number>
  );

  return formattedMetrics;
}
