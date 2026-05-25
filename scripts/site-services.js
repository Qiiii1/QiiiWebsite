(() => {
  const localHosts = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
  if (localHosts.has(window.location.hostname)) return;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = "/_vercel/insights/script.js";
  document.head.appendChild(analyticsScript);

  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };

  const speedInsightsScript = document.createElement("script");
  speedInsightsScript.defer = true;
  speedInsightsScript.src = "/_vercel/speed-insights/script.js";
  document.head.appendChild(speedInsightsScript);
})();
