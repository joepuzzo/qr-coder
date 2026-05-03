import { useEffect, useRef } from "react";

const AD_SCRIPT_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

/**
 * Injects the AdSense loader once, then fills this unit via push().
 * Remove <AdSenseDisplay /> from the tree to disable ads entirely.
 */
function ensureAdsByGoogleScript(clientId) {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  const src = `${AD_SCRIPT_SRC}?client=${encodeURIComponent(clientId)}`;
  const existing = document.querySelector(`script[src="${src}"]`);

  if (existing) {
    if (existing.getAttribute("data-loaded") === "1") {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const done = () => {
        existing.setAttribute("data-loaded", "1");
        resolve();
      };
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("AdSense script failed to load")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = src;
    const done = () => {
      script.setAttribute("data-loaded", "1");
      resolve();
    };
    script.addEventListener("load", done, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("AdSense script failed to load")),
      { once: true },
    );
    document.head.appendChild(script);
  });
}

export function AdSenseDisplay({
  className,
  adClient = "ca-pub-8470395062876076",
  adSlot = "6350778786",
}) {
  const pushedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await ensureAdsByGoogleScript(adClient);
        if (cancelled || pushedRef.current) return;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
        if (import.meta.env.DEV) {
          console.info(
            "[AdSense] push() ran for slot — on localhost Google often returns no ad (blank slot). Use your deployed URL or a hosts mapping to your approved domain to preview fills.",
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adClient]);

  const isDev = import.meta.env.DEV;

  return (
    <div
      className={[className, isDev ? "ad-slot--local-preview" : ""]
        .filter(Boolean)
        .join(" ")}
      title={
        isDev
          ? "AdSense usually does not fill ads on localhost. Open your live site or map a real hostname in /etc/hosts to preview."
          : undefined
      }
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(isDev ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
