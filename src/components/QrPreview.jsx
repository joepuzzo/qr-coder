import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { useFormState } from "informed";
import { getShapeStyleOrDefault } from "../shapeStyles";
import { normalizeQrColor } from "../qrColor.js";
import { buildQrPayload } from "../buildQrPayload.js";
import "./QrPreview.css";

/** On-screen preview size (CSS scales the SVG). */
const QR_SIZE = 340;
/** PNG export — larger canvas for sharper downloads. */
const DOWNLOAD_PNG_SIZE = 1024;

function buildQrStylingOptions({
  size,
  data,
  shapeStyleId,
  logoDataUrl,
  qrColor,
}) {
  const preset = getShapeStyleOrDefault(shapeStyleId ?? "rounded");
  const fg = normalizeQrColor(qrColor);
  const bg = "#ffffff";
  const hasLogo =
    typeof logoDataUrl === "string" && logoDataUrl.trim().length > 0;

  const options = {
    width: size,
    height: size,
    type: "svg",
    data,
    margin: 6,
    qrOptions: {
      errorCorrectionLevel: hasLogo ? "H" : "M",
    },
    dotsOptions: {
      ...preset.options.dotsOptions,
      color: fg,
    },
    cornersSquareOptions: {
      ...preset.options.cornersSquareOptions,
      color: fg,
    },
    cornersDotOptions: {
      ...preset.options.cornersDotOptions,
      color: fg,
    },
    backgroundOptions: { color: bg },
  };

  if (hasLogo) {
    options.image = logoDataUrl;
    options.imageOptions = {
      crossOrigin: "anonymous",
      margin: 6,
      imageSize: 0.32,
      hideBackgroundDots: true,
    };
  }

  if (preset.options.shape) {
    options.shape = preset.options.shape;
  }

  return options;
}

export function QrPreview() {
  const { values } = useFormState();
  const data = buildQrPayload(values);
  const shapeStyleId = values.shapeStyle;
  const logoDataUrl = values.logo;
  const qrColor = values.qrColor;

  const containerRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!data) {
      el.innerHTML = "";
      qrRef.current = null;
      return;
    }

    const base = buildQrStylingOptions({
      size: QR_SIZE,
      data,
      shapeStyleId,
      logoDataUrl,
      qrColor,
    });

    // console.log("base", base);

    el.innerHTML = "";
    qrRef.current = null;
    const qr = new QRCodeStyling(base);
    qr.append(el);
    qrRef.current = qr;
  }, [data, shapeStyleId, logoDataUrl, qrColor]);

  useEffect(() => {
    const el = containerRef.current;
    return () => {
      if (el) el.innerHTML = "";
      qrRef.current = null;
    };
  }, []);

  function handleDownloadPng() {
    if (!data) return;
    const exportQr = new QRCodeStyling(
      buildQrStylingOptions({
        size: DOWNLOAD_PNG_SIZE,
        data,
        shapeStyleId,
        logoDataUrl,
        qrColor,
      }),
    );
    void exportQr.download({ name: "qr-code", extension: "png" });
  }

  return (
    <div className="qr-preview">
      <h2 className="qr-preview__title">Preview</h2>
      <div className="qr-preview__frame">
        {!data ? (
          <p className="qr-preview__placeholder">
            Fill in the fields for the selected type to generate a QR code.
          </p>
        ) : null}
        <div ref={containerRef} className="qr-preview__canvas" hidden={!data} />
      </div>
      {data ? (
        <button
          type="button"
          className="qr-preview__download"
          onClick={handleDownloadPng}
        >
          Download PNG
        </button>
      ) : null}
    </div>
  );
}
