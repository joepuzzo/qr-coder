import { Relevant, Input, TextArea, Select, Checkbox, Debug } from "informed";
import { LinkUrlInput } from "./LinkUrlInput.jsx";
import { WIFI_ENCRYPTION_OPTIONS } from "../payloadTypes.js";
import "./payload-fields.css";

const wifiSelectOptions = WIFI_ENCRYPTION_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

export function PayloadFields() {
  // const phoneFormatter = "1 ###-###-####";

  // const phoneParser = (value) => {
  //   return value.replace("1 ", "").replace(/-/g, "");
  // };

  const phoneFormatter = undefined;
  const phoneParser = undefined;

  return (
    <div className="payload-fields">
      <Relevant
        when={({ formState }) => formState.values.payloadType === "link"}
      >
        <LinkUrlInput
          name="link"
          label="URL"
          placeholder="https://example.com or example.com"
        />
      </Relevant>

      <Relevant
        when={({ formState }) => formState.values.payloadType === "email"}
      >
        <div className="payload-fields__stack">
          <Input
            name="emailTo"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
          />
          <Input
            name="emailSubject"
            label="Subject"
            placeholder="Optional"
            autocomplete="off"
          />
          <TextArea
            name="emailBody"
            label="Message"
            rows={4}
            placeholder="Optional"
          />
        </div>
      </Relevant>

      <Relevant
        when={({ formState }) => formState.values.payloadType === "phone"}
      >
        <Input
          name="phoneNumber"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="555-123-4567"
          formatter={phoneFormatter}
          parser={phoneParser}
        />
      </Relevant>

      <Relevant
        when={({ formState }) => formState.values.payloadType === "sms"}
      >
        <div className="payload-fields__stack">
          <Input
            name="smsNumber"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="555-123-4567"
            formatter={phoneFormatter}
            parser={phoneParser}
          />
          <TextArea
            name="smsBody"
            label="Message"
            rows={3}
            placeholder="Optional"
          />
        </div>
      </Relevant>

      <Relevant
        when={({ formState }) => formState.values.payloadType === "wifi"}
      >
        <div className="payload-fields__stack">
          <Input
            name="wifiSsid"
            label="Network name (SSID)"
            type="text"
            autoComplete="off"
          />
          <Select
            name="wifiEncryption"
            label="Encryption"
            options={wifiSelectOptions}
          />
          <Relevant
            when={({ formState }) =>
              formState.values.wifiEncryption !== "nopass"
            }
          >
            <Input
              name="wifiPassword"
              label="Password"
              type="password"
              autoComplete="off"
              placeholder="Network password"
            />
          </Relevant>
          <Checkbox name="wifiHidden" label="Hidden network" />
        </div>
      </Relevant>

      <Relevant
        when={({ formState }) => formState.values.payloadType === "vcard"}
      >
        <div className="payload-fields__stack payload-fields__stack--vcard">
          <div className="payload-fields__row payload-fields__row--2">
            <div className="payload-fields__cell">
              <Input
                name="vcardFirstName"
                label="First name"
                type="text"
                autoComplete="given-name"
                placeholder="Jane"
              />
            </div>
            <div className="payload-fields__cell">
              <Input
                name="vcardLastName"
                label="Last name"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="payload-fields__row payload-fields__row--2">
            <div className="payload-fields__cell">
              <Input
                name="vcardTel"
                label="Phone"
                type="tel"
                autoComplete="tel"
                placeholder="Optional"
                formatter={phoneFormatter}
                parser={phoneParser}
              />
            </div>
            <div className="payload-fields__cell">
              <Input
                name="vcardEmail"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="payload-fields__row payload-fields__row--2">
            <div className="payload-fields__cell">
              <Input
                name="vcardOrg"
                label="Organization"
                type="text"
                autoComplete="organization"
                placeholder="Optional"
              />
            </div>
            <div className="payload-fields__cell">
              <Input
                name="vcardTitle"
                label="Job title"
                type="text"
                autoComplete="organization-title"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="payload-fields__row payload-fields__row--full">
            <TextArea
              name="vcardAddress"
              label="Address"
              rows={2}
              autoComplete="street-address"
              placeholder="Street, building, etc."
            />
          </div>
          <div className="payload-fields__row payload-fields__row--3">
            <div className="payload-fields__cell">
              <Input
                name="vcardCity"
                label="City"
                type="text"
                autoComplete="address-level2"
                placeholder="Optional"
              />
            </div>
            <div className="payload-fields__cell">
              <Input
                name="vcardPostalCode"
                label="Postal code"
                type="text"
                autoComplete="postal-code"
                placeholder="Optional"
              />
            </div>
            <div className="payload-fields__cell">
              <Input
                name="vcardCountry"
                label="Country"
                type="text"
                autoComplete="country-name"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="payload-fields__row payload-fields__row--full">
            <Input
              name="vcardUrl"
              label="Website"
              type="url"
              autoComplete="url"
              placeholder="https://example.com"
            />
          </div>
          <div className="payload-fields__row payload-fields__row--full">
            <TextArea
              name="vcardNote"
              label="Notes"
              rows={3}
              placeholder="Optional"
            />
          </div>
        </div>
      </Relevant>
      {/* <Debug values /> */}
    </div>
  );
}
