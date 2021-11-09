import { CDPSession, Page } from "puppeteer";

export async function disableCache(page: Page, session: CDPSession) {
  await page.setCacheEnabled(false);
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });
}
