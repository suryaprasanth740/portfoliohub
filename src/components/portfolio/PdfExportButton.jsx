import { useState } from 'react'
import { exportElementToPdf } from '../../lib/pdfExport'

export default function PdfExportButton({ targetRef, filename }) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await exportElementToPdf(targetRef.current, filename)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60"
      style={{ borderColor: 'var(--ph-border)', color: 'var(--ph-text)', background: 'var(--ph-surface)' }}
    >
      {exporting ? 'Exporting…' : '📄 Download PDF'}
    </button>
  )
}
