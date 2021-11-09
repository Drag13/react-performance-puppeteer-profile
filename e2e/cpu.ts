import { CDPSession } from "puppeteer";

export const X4 = 4;
export const X2 = 2;

export async function setupCPUThrottling(session: CDPSession, rate: number) {
  await session.send("Emulation.setCPUThrottlingRate", { rate });
}
