import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * One-click PDF export: rasterizes a DOM node with html2canvas and slices
 * it into as many A4 pages as needed with jsPDF, so a full portfolio page
 * (taller than one screen) exports cleanly.
 */
export async function exportElementToPdf(element, filename = 'portfolio.pdf') {
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidthMm = pageWidth
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width

  let heightLeft = imgHeightMm
  let position = 0

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidthMm, imgHeightMm)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeightMm
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidthMm, imgHeightMm)
    heightLeft -= pageHeight
  }

  await savePdf(pdf, filename)
}

/**
 * Hand the generated PDF to the viewer. A page running as a published
 * Cowork Artifact is sandboxed against script-triggered downloads (jsPDF's
 * default `.save()` clicks a hidden `<a download>`, which is inert there),
 * so when the artifact `downloads` capability is available we go through
 * it instead; every other host (the dev server, a real deployment) keeps
 * using jsPDF's normal save.
 */
async function savePdf(pdf, filename) {
  const claude = typeof window !== 'undefined' ? window.claude : undefined
  if (claude && typeof claude.use === 'function') {
    try {
      const downloads = await claude.use('downloads')
      if (downloads) {
        const blob = pdf.output('blob')
        await downloads.save({ filename, data: blob })
        return
      }
    } catch {
      // Fall through to the ordinary browser save below (e.g. the viewer
      // declined, or this view can't run the capability).
    }
  }
  pdf.save(filename)
}
