import { useEffect, useRef, useLayoutEffect } from "react";

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

/**
 * @typedef {"pending" | "serving" | "blocked"} AdSenseAvailability
 * `blocked` = high confidence (loader script failed — typical when Brave / uBlock blocks the network).
 * `serving` = we saw an iframe or Google’s “filled” status on the slot.
 * `pending` = still trying or no fill yet (includes “under review” / no inventory — keep default copy).
 */

function watchInsForFill(ins, isCancelled, onServing) {
  let finished = false;
  /** @type {MutationObserver | null} */
  let mo = null;
  /** @type {ReturnType<typeof setInterval> | null} */
  let iv = null;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let to = null;

  const stop = () => {
    if (mo) mo.disconnect();
    if (iv) clearInterval(iv);
    if (to) clearTimeout(to);
    mo = null;
    iv = null;
    to = null;
  };

  const finish = () => {
    if (finished || isCancelled()) return;
    finished = true;
    onServing();
    stop();
  };

  const isFilled = () => {
    if (!ins.isConnected) return false;
    if (ins.querySelector("iframe")) return true;
    const st = ins.getAttribute("data-adsbygoogle-status");
    if (st === "filled" || st === "done") return true;
    return false;
  };

  if (isFilled()) {
    if (!isCancelled()) {
      finished = true;
      onServing();
    }
    return () => {};
  }

  mo = new MutationObserver(() => {
    if (!isCancelled() && isFilled()) finish();
  });
  mo.observe(ins, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-adsbygoogle-status"],
  });

  iv = setInterval(() => {
    if (!isCancelled() && isFilled()) finish();
  }, 400);

  to = setTimeout(stop, 20000);

  return () => {
    stop();
  };
}

export function AdSenseDisplay({
  className,
  adClient = "ca-pub-8470395062876076",
  adSlot = "6350778786",
  /** @param {AdSenseAvailability} availability */
  onAvailabilityChange,
}) {
  const pushedRef = useRef(false);
  const insRef = useRef(null);
  const onAvailabilityChangeRef = useRef(onAvailabilityChange);

  useLayoutEffect(() => {
    onAvailabilityChangeRef.current = onAvailabilityChange;
  });

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    let stopWatching = () => {};

    const emit = (/** @type {AdSenseAvailability} */ a) => {
      onAvailabilityChangeRef.current?.(a);
    };

    emit("pending");

    (async () => {
      try {
        await ensureAdsByGoogleScript(adClient);
        if (cancelled || pushedRef.current) return;
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (pushErr) {
          console.error(pushErr);
          if (!cancelled) emit("blocked");
          return;
        }
        pushedRef.current = true;
        if (import.meta.env.DEV) {
          console.info(
            "[AdSense] push() ran for slot — on localhost Google often returns no ad (blank slot). Use your deployed URL or a hosts mapping to your approved domain to preview fills.",
          );
        }

        const ins = insRef.current;
        if (ins && !cancelled) {
          stopWatching = watchInsForFill(ins, isCancelled, () => {
            if (!cancelled) emit("serving");
          });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) emit("blocked");
      }
    })();

    return () => {
      cancelled = true;
      stopWatching();
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
        ref={insRef}
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
