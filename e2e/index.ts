import { launch } from "puppeteer";
import { getPerformanceEntries } from "./performance-entries";
import { setupPerfromanceScripts } from "./lcp";
import { extractWebVitals } from "./extract-web-vitals";
import { getCustomMetrics } from "./custom-metrics";
import { extractCoreWebVitals } from "./core-web-vitals";

const pageUrl = "http://localhost:5000"; // url to open

(async function (url) {
  let browser;
  try {
    // launch the Chrome browser
    browser = await launch({ product: "chrome", args: ["--no-sandbox"] });
    // launch the page
    const page = await browser.newPage();

    // navigate to the url and wait untill all network activity stops

    await page.evaluateOnNewDocument(setupPerfromanceScripts);
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

    console.log({ ...metrics, ...perfEntries, ...webVitals, ...customMetris, ...coreWebVitals });
  } catch (error) {
    console.error(error);
  } finally {
    // close the browser correctly even if something went wrong
    browser != null && (await browser.close());
  }
})(pageUrl);
