import { launch, Page } from "puppeteer";
import { getPerformanceEntries } from "./performance-entries";
import { setupPerfromanceScripts } from "./lcp";
import { extractWebVitals } from "./extract-web-vitals";
import { getCustomMetrics } from "./custom-metrics";
import { extractCoreWebVitals } from "./core-web-vitals";
import { setupNetworkConditions, SLOW_3G } from "./network";
import { X2, setupCPUThrottling, X4 } from "./cpu";
import { disableCache } from "./cache";
import { TestRunner } from "./runner";

const pageUrl = "http://localhost:5000"; // url to open

// warm up the browser
async function warmingBrowser(url: string, pageInstance: Page) {
  await pageInstance.goto(url, { waitUntil: "networkidle0" });
  await pageInstance.close();
}

(async function (testingUrl) {
  // launch the Chrome browser
  const browser = await launch({ product: "chrome", args: ["--no-sandbox"] });
  try {
    const testSuite = [
      { network: SLOW_3G, cpu: X2, url: testingUrl },
      { network: SLOW_3G, cpu: X4, url: testingUrl },
    ];

    await warmingBrowser(testingUrl, await browser.newPage());

    const testRun = new TestRunner(testSuite, async ({ network, cpu, url }) => {
      // launch the page
      const page = await browser.newPage();

      // create CDP session
      const pageSession = await page.target().createCDPSession();

      // turn off caching
      await disableCache(page, pageSession);

      await pageSession.send("Network.enable");

      // insert performance scripts
      await page.evaluateOnNewDocument(setupPerfromanceScripts);

      // setup network
      await setupNetworkConditions(pageSession, network);

      // slowdown CPU
      await setupCPUThrottling(pageSession, cpu);

      // navigate to the url and wait untill all network activity stops
      await page.goto(url, { waitUntil: "networkidle0" });

      // dump page metrics
      const metrics = await page.metrics();

      //dump fcp and ttfb
      const perfEntries = await getPerformanceEntries(page);

      // dump web vitals
      const webVitals = await extractWebVitals(page);

      //dump custom metrics
      const customMetris = await getCustomMetrics(page);

      //dump core vitals from web-vitals
      const coreWebVitals = await extractCoreWebVitals(page);

      await page.close();

      return {
        ...metrics,
        ...perfEntries,
        ...webVitals,
        ...customMetris,
        ...coreWebVitals,
      };
    });

    for await (const result of testRun) {
      console.log(result);
    }
  } catch (error) {
    console.error(error);
  } finally {
    // close the browser correctly even if something went wrong
    browser != null && (await browser.close());
  }
})(pageUrl);
