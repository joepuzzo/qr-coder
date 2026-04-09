import { useMemo } from "react";
import { Form } from "informed";
import { LinkUrlInput } from "./components/LinkUrlInput.jsx";
import { ShapeStyleInput } from "./components/ShapeStyleInput.jsx";
import { LogoUploadInput } from "./components/LogoUploadInput.jsx";
import { QrPreview } from "./components/QrPreview.jsx";
import { ShareLinkButton } from "./components/ShareLinkButton.jsx";
import { QrColorInput } from "./components/QrColorInput.jsx";
import { getFormInitialValuesFromSearch } from "./urlFormParams.js";
import "./App.css";

export default function App() {
  const initialValues = useMemo(
    () =>
      getFormInitialValuesFromSearch(
        typeof window !== "undefined" ? window.location.search : "",
      ),
    [],
  );

  return (
    <Form initialValues={initialValues}>
      <div className="page">
        <header className="header">
          <div className="header__row">
            <div className="header__row-spacer" aria-hidden="true" />
            <h1>QR Coder</h1>
            <ShareLinkButton />
          </div>
          <p className="lede">
            Paste a link, pick a shape style, optionally add a logo, and preview
            the QR code.
          </p>
        </header>

        <div className="layout">
          <section className="panel" aria-label="QR settings">
            <LinkUrlInput
              name="link"
              label="Link"
              placeholder="https://example.com or example.com"
            />
            <ShapeStyleInput name="shapeStyle" label="Shape style" />
            <QrColorInput name="qrColor" label="QR color" />
            <LogoUploadInput name="logo" label="Center logo (optional)" />
          </section>
          <section className="panel panel--preview" aria-label="QR preview">
            <QrPreview />
          </section>
        </div>
      </div>
    </Form>
  );
}
