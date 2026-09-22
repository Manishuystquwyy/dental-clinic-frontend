import { useEffect, useRef, useState } from 'react'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

function PdfPage({ pdf, pageNumber }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let renderTask
    pdf.getPage(pageNumber).then(async (page) => {
      if (!active) return
      const canvas = canvasRef.current
      const original = page.getViewport({ scale: 1 })
      const scale = Math.min(2, 1400 / original.width, 2000 / original.height)
      const viewport = page.getViewport({ scale })
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport })
      await renderTask.promise
      if (active) setLoading(false)
    }).catch(() => {
      if (active) { setLoading(false); setError('This page could not be previewed. Download the file to view it.') }
    })
    return () => { active = false; renderTask?.cancel() }
  }, [pdf, pageNumber])

  return <div className="record-pdf-page" aria-busy={loading}>
    {loading && <p role="status">Rendering page…</p>}
    {error && <p role="alert">{error}</p>}
    <canvas ref={canvasRef} role="img" aria-label={`Report page ${pageNumber}. Download the PDF for its original text.`} hidden={loading || Boolean(error)} />
  </div>
}

export default function MedicalPdfPreview({ url }) {
  const [pdf, setPdf] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let task
    import('pdfjs-dist').then(async (pdfjs) => {
      if (!active) return
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
      const assetBase = `${import.meta.env.BASE_URL}pdfjs/`
      task = pdfjs.getDocument({
        url, useSystemFonts: true,
        cMapUrl: `${assetBase}cmaps/`, standardFontDataUrl: `${assetBase}standard_fonts/`,
        wasmUrl: `${assetBase}wasm/`, iccUrl: `${assetBase}iccs/`,
      })
      // Password-protected documents remain downloadable in their original form.
      task.onPassword = () => {
        if (active) setError('This PDF is password protected. Download it and open it with your PDF reader.')
        void task.destroy()
      }
      const document = await task.promise
      if (active) setPdf(document)
    }).catch(() => { if (active) setError('This PDF could not be previewed. Download the file to view it.') })
    return () => { active = false; if (task) void task.destroy() }
  }, [url])

  if (error) return <p role="alert">{error}</p>
  if (!pdf) return <p role="status">Loading PDF preview…</p>
  return <div className="record-pdf-preview">
    <div className="record-pdf-controls" aria-label="PDF pages">
      <button type="button" className="record-button secondary" onClick={() => setPageNumber((value) => value - 1)} disabled={pageNumber === 1}>Previous page</button>
      <span aria-live="polite">Page {pageNumber} of {pdf.numPages}</span>
      <button type="button" className="record-button secondary" onClick={() => setPageNumber((value) => value + 1)} disabled={pageNumber === pdf.numPages}>Next page</button>
    </div>
    <PdfPage key={pageNumber} pdf={pdf} pageNumber={pageNumber} />
  </div>
}
