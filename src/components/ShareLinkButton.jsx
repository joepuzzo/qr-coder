import { useState } from "react";
import { useFormApi } from "informed";
import { buildShareUrl } from "../urlFormParams.js";
import "./ShareLinkButton.css";

export function ShareLinkButton() {
  const formApi = useFormApi();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setError(null);
    const values = formApi.getFormState().values;
    const url = buildShareUrl(values);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // fall through
    }

    setError("Could not copy. Copy the address bar manually.");
    window.setTimeout(() => setError(null), 4000);
  }

  return (
    <div className="share-link">
      <button
        type="button"
        className={`share-link__btn${copied ? " share-link__btn--copied" : ""}`}
        onClick={handleClick}
        aria-label={copied ? "Copied" : "Copy link to this configuration"}
        title={
          copied ? "Copied" : "Copy a shared link to these QR code settings."
        }
      >
        {copied ? (
          <svg
            className="share-link__icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            className="share-link__icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      {error ? (
        <span className="share-link__hint share-link__hint--error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
