import { Form } from 'informed'
import { LinkUrlInput } from './components/LinkUrlInput.jsx'
import { ShapeStyleInput } from './components/ShapeStyleInput.jsx'
import { LogoUploadInput } from './components/LogoUploadInput.jsx'
import { QrPreview } from './components/QrPreview.jsx'
import './App.css'

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <h1>QR Coder</h1>
        <p className="lede">
          Paste a link, pick a shape style, optionally add a logo, and preview
          the QR code.
        </p>
      </header>

      <Form
        initialValues={{
          link: '',
          shapeStyle: 'rounded',
          logo: '',
        }}
      >
        <div className="layout">
          <section className="panel" aria-label="QR settings">
            <LinkUrlInput
              name="link"
              label="Link"
              placeholder="https://example.com or example.com"
            />
            <ShapeStyleInput name="shapeStyle" label="Shape style" />
            <LogoUploadInput
              name="logo"
              label="Center logo (optional)"
            />
          </section>
          <section className="panel panel--preview" aria-label="QR preview">
            <QrPreview />
          </section>
        </div>
      </Form>
    </div>
  )
}
