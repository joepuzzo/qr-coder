import { useMemo, useState, useCallback } from "react";
import { Form } from "informed";
import { ShapeStyleInput } from "./components/ShapeStyleInput.jsx";
import { LogoUploadInput } from "./components/LogoUploadInput.jsx";
import { QrPreview } from "./components/QrPreview.jsx";
import { ShareLinkButton } from "./components/ShareLinkButton.jsx";
import { QrColorInput } from "./components/QrColorInput.jsx";
import { ToggleButtonInput } from "./components/ToggleButtonInput.jsx";
import { PayloadTypeInput } from "./components/PayloadTypeInput.jsx";
import { PayloadFields } from "./components/PayloadFields.jsx";
import { AdSenseDisplay } from "./components/AdSenseDisplay.jsx";
import { getFormInitialValuesFromSearch } from "./urlFormParams.js";
import "./App.css";

const AD_SUPPORT_DEFAULT =
  "Yes, these ads pay for the free QR generator. You're welcome.";
const AD_SUPPORT_BLOCKED =
  "Normally we'd show ads here to keep the QR generator free… but your ad blocker won the round. Lucky you!";

export default function App() {
  const [adSupportVariant, setAdSupportVariant] = useState("default");

  const onAdAvailabilityChange = useCallback((availability) => {
    setAdSupportVariant(availability === "blocked" ? "blocked" : "default");
  }, []);

  const initialValues = useMemo(
    () =>
      getFormInitialValuesFromSearch(
        typeof window !== "undefined" ? window.location.search : "",
      ),
    [],
  );

  return (
    <Form initialValues={initialValues} keepStateIfRelevant>
      <div className="page">
        <header className="header">
          <div className="header__row">
            <div className="header__row-spacer" aria-hidden="true" />
            <h1>QR Coder</h1>
            <ShareLinkButton />
          </div>
          <p className="lede">
            Choose a type, fill in the details, then style and download your QR
            code.
          </p>
        </header>
        <div className="layout">
          <section className="panel" aria-label="QR settings">
            <PayloadTypeInput name="payloadType" label="Type" />
            <PayloadFields />
            <ShapeStyleInput name="shapeStyle" label="Shape style" />
            <div className="style-controls">
              <QrColorInput
                name="qrColor"
                label="QR color"
                className="style-controls__color"
              />
              <ToggleButtonInput
                name="downloadTransparentBackground"
                label="Transparent"
              />
            </div>
            <LogoUploadInput name="logo" label="Center logo (optional)" />
          </section>
          <section className="panel panel--preview" aria-label="QR preview">
            <QrPreview />
          </section>
        </div>
        <section className="panel panel--ad" aria-label="Advertisement">
          <p className="lede">
            {adSupportVariant === "blocked"
              ? AD_SUPPORT_BLOCKED
              : AD_SUPPORT_DEFAULT}
          </p>
          <AdSenseDisplay
            className="ad-slot"
            onAvailabilityChange={onAdAvailabilityChange}
          />
        </section>
      </div>
    </Form>
  );
}
