declare interface Window {
  _pe: PerformanceEntry[];
  _cwv: { name: string; value: number }[];
}

declare type NetworkConditions = {
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
};
