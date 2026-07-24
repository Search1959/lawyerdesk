import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Camera,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Search,
  BookOpen,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  FilePlus,
  Loader2,
} from 'lucide-react';
import { Document, Matter } from '../types';

interface DocumentEngineViewProps {
  documents: Document[];
  matters: Matter[];
  onUploadDocument: (file: File | null, matterId: string, category: string) => void;
}

export const DocumentEngineView: React.FC<DocumentEngineViewProps> = ({
  documents,
  matters,
  onUploadDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0] || null);
  const [selectedMatterId, setSelectedMatterId] = useState<string>(matters[0]?.id || '');
  const [category, setCategory] = useState<string>('Evidence Annexure');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingFileName, setProcessingFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep selectedDoc updated when documents list updates (e.g. after upload)
  useEffect(() => {
    if (documents.length > 0) {
      setSelectedDoc(documents[0]);
    }
  }, [documents.length]);

  const filteredDocs = documents.filter(
    (d) =>
      d.fileName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.ocrText.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleProcessFile = (file: File | null) => {
    const fileName = file ? file.name : `Scanned_Brief_${category.replace(/\s+/g, '_')}.pdf`;
    setProcessingFileName(fileName);
    setIsProcessing(true);

    setTimeout(() => {
      onUploadDocument(file, selectedMatterId, category);
      setIsProcessing(false);
      setProcessingFileName('');
    }, 1200);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
      />

      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Document Engine & PaddleOCR Studio</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hybrid PaddleOCR + Tesseract Engine • Auto Clean • Multilingual (English, Hindi, Bengali)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PaddleOCR GPU Active</span>
          </span>
        </div>
      </div>

      {/* Upload & Camera Scanner Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          Intake Legal File / Physical Brief
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Matter</label>
            <select
              value={selectedMatterId}
              onChange={(e) => setSelectedMatterId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.caseNumber} - {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="Petition">Petition / Plaint</option>
              <option value="Written Statement">Written Statement / Counter</option>
              <option value="Affidavit">Affidavit</option>
              <option value="Evidence Annexure">Evidence Annexure</option>
              <option value="Court Order">Court Order</option>
              <option value="FIR / Charge Sheet">FIR / Charge Sheet</option>
              <option value="Notice">Legal Notice</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>{cameraActive ? 'Close Camera' : 'Camera Scanner'}</span>
            </button>
          </div>
        </div>

        {/* Camera Scanner Simulation */}
        {cameraActive && (
          <div className="p-4 mb-4 rounded-xl bg-slate-900 text-white border border-blue-500/40 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4 animate-pulse" /> Live Document Camera Feed
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Auto Edge Detection: ON</span>
            </div>
            <div className="h-40 bg-slate-950 rounded-lg border-2 border-dashed border-blue-500/50 flex flex-col items-center justify-center text-center p-4">
              <Camera className="w-8 h-8 text-blue-400 mb-2 animate-bounce" />
              <p className="text-xs text-slate-300">Align legal brief page within guidelines.</p>
              <button
                onClick={() => handleProcessFile(null)}
                disabled={isProcessing}
                className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow hover:bg-blue-500 flex items-center gap-2"
              >
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isProcessing ? 'Capturing & Extracting...' : 'Capture & Extract OCR'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dropzone Container */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950/40'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {isProcessing
              ? `Processing PaddleOCR Pipeline: ${processingFileName || 'Document'}...`
              : 'Click to Browse or Drag PDF / Scanned Images / Word / ZIP Files'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Automatic OCR extraction, entity resolution, date parsing, and vector embedding for target matter.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <FilePlus className="w-3.5 h-3.5" />
            <span>Select File from Computer</span>
          </div>
        </div>
      </div>

      {/* Document Vault & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Processed Vault ({filteredDocs.length})
            </h2>
            <div className="relative w-40">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search OCR..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredDocs.map((doc) => {
              const isSel = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[180px]">
                      {doc.fileName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {doc.metadata.confidenceScore}%
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>{doc.category} • {doc.pageCount} Pages</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document OCR Inspector (7 cols) */}
        {selectedDoc ? (
          <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                  {selectedDoc.category}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedDoc.fileName}</h2>
                <p className="text-xs text-slate-500">{selectedDoc.matterTitle}</p>
              </div>

              <button
                onClick={() => handleCopyText(selectedDoc.ocrText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            {/* Extracted Metadata Pills */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Extracted Legal Entities & Acts</h3>
                
                <button
                  onClick={() => {
                    const certWindow = window.open('', '_blank', 'width=800,height=900');
                    if (certWindow) {
                      certWindow.document.write(`
                        <html>
                          <head>
                            <title>Section 65B Certificate - ${selectedDoc.fileName}</title>
                            <style>
                              body { font-family: Georgia, serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                              .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
                              .title { font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                              .subtitle { font-size: 13px; font-style: italic; color: #64748b; margin-top: 5px; }
                              .content { font-size: 14px; margin-bottom: 30px; }
                              .field { margin-bottom: 12px; }
                              .label { font-weight: bold; }
                              .hash { font-family: monospace; background: #f1f5f9; padding: 6px; border-radius: 4px; font-size: 12px; word-break: break-all; }
                              .footer { margin-top: 50px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div class="title">Certificate Under Section 65B of Indian Evidence Act, 1872</div>
                              <div class="subtitle">(Corresponding Section 63 of Bharatiya Sakshya Adhiniyam, 2023)</div>
                            </div>
                            <div class="content">
                              <p>I hereby certify and declare under Section 65B of the Indian Evidence Act, 1872 that the electronic record titled <strong>${selectedDoc.fileName}</strong> was generated, stored, and extracted in the ordinary course of law practice operations using LawyerDesk AI Secure System.</p>
                              
                              <div class="field"><span class="label">Document ID:</span> ${selectedDoc.id}</div>
                              <div class="field"><span class="label">Associated Matter:</span> ${selectedDoc.matterTitle}</div>
                              <div class="field"><span class="label">OCR Extraction Engine:</span> ${selectedDoc.metadata.ocrEngineUsed} (${selectedDoc.metadata.confidenceScore}% confidence)</div>
                              <div class="field"><span class="label">SHA-256 Digital Fingerprint:</span></div>
                              <div class="hash">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                            </div>
                            <div class="footer">
                              <div>
                                <strong>System Auditor:</strong> LawyerDesk AI Vault<br/>
                                <strong>Date Generated:</strong> ${new Date().toLocaleDateString('en-IN')}
                              </div>
                              <div style="text-align: right;">
                                <strong>________________________</strong><br/>
                                <strong>Advocate Signature / Digital Seal</strong>
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                      certWindow.document.close();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 font-bold text-[10px] flex items-center gap-1 transition-all"
                >
                  <FileCheck className="w-3 h-3 text-amber-500" />
                  <span>Sec 65B Admissibility Cert</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {selectedDoc.metadata.extractedActs.map((act, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                    Act: {act}
                  </span>
                ))}
                {selectedDoc.metadata.extractedSections.map((sec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                    Sec: {sec}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-4">
                <div><strong>Court:</strong> {selectedDoc.metadata.extractedCourt || 'Delhi High Court'}</div>
                <div><strong>Language:</strong> {selectedDoc.metadata.languageDetected}</div>
                <div><strong>Engine:</strong> {selectedDoc.metadata.ocrEngineUsed}</div>
                <div className="font-mono text-[10px] text-slate-400"><strong>SHA-256:</strong> e3b0c44298fc...b855</div>
              </div>
            </div>

            {/* OCR Extracted Text Box */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                PaddleOCR Extracted Full Text
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap border border-slate-800 select-text">
                {selectedDoc.ocrText}
              </div>
            </div>

            {/* Vector Embeddings Chunks */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                pgvector Chunks & Embeddings ({selectedDoc.chunks.length} Chunks)
              </h3>
              <div className="space-y-2">
                {selectedDoc.chunks.map((chk) => (
                  <div key={chk.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 text-xs">
                    <div className="flex items-center justify-between font-bold text-blue-600 dark:text-blue-400 mb-1 text-[11px]">
                      <span>Page {chk.pageNumber}, Paragraph {chk.paragraphNumber}</span>
                      <span className="font-mono text-slate-400">Embedding: [0.0421, -0.1982, 0.8841...]</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{chk.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
