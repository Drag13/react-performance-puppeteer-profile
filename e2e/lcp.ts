export function setupPerfromanceScripts() {
  // we will store the data here
  window._pe = [];

  // install LCP obeserver
  function installLCPObserver() {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      // store the last found entry
      window._pe.push(lastEntry);
    });

    // start observing
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    return lcpObserver;
  }

  const lcpObserver = installLCPObserver();

  // save data and disconnect in case page become hidden
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      lcpObserver.takeRecords();
      lcpObserver.disconnect();
    }
  });
}
