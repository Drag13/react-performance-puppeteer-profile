import { CDPSession } from "puppeteer";

export const SLOW_3G: NetworkConditions = {
  downloadThroughput: (0.4 * 1024 * 1024) / 8,
  uploadThroughput: (0.4 * 1024 * 1024) / 8,
  latency: 2000,
};

export async function setupNetworkConditions(
  session: CDPSession,
  network: NetworkConditions
) {
  await session.send("Network.emulateNetworkConditions", {
    ...network,
    offline: false,
  });
}
