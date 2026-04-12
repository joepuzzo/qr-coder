import { Relevant, Input, TextArea, Select, Checkbox } from "informed";
import { LinkUrlInput } from "./LinkUrlInput.jsx";
import { WIFI_ENCRYPTION_OPTIONS } from "../payloadTypes.js";
import "./payload-fields.css";

const wifiSelectOptions = WIFI_ENCRYPTION_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

export function PayloadFields() {
  const phoneFormatter = "###-###-####";

  const phoneParser = (value) => {
    return value.replace(/-/g, "");
  };

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
            type="text"
            placeholder="Optional"
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
    </div>
  );
}
