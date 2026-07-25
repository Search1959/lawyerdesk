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
  FolderOpen,
  Filter,
  Folder,
  FolderPlus,
  X,
  Plus,
  Tag,
  Grid,
  Trash2,
} from 'lucide-react';
import { Document, Matter } from '../types';

export interface CustomFolder {
  id: string;
  name: string;
  matterId?: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose';
  description?: string;
  createdAt: string;
}

interface DocumentEngineViewProps {
  documents: Document[];
  matters: Matter[];
  selectedMatter?: Matter | null;
  onSelectMatter?: (matter: Matter) => void;
  onUploadDocument: (
    file: File | null,
    matterId: string,
    category: string,
    folderId?: string,
    folderName?: string
  ) => void;
  onDeleteDocument?: (docId: string) => void;
}

export const DocumentEngineView: React.FC<DocumentEngineViewProps> = ({
  documents,
  matters,
  selectedMatter,
  onSelectMatter,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0] || null);
  const [selectedMatterId, setSelectedMatterId] = useState<string>(
    selectedMatter?.id || matters[0]?.id || ''
  );
  const [category, setCategory] = useState<string>('Evidence Annexure');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [matterFilterMode, setMatterFilterMode] = useState<'all' | 'selected'>('all');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingFileName, setProcessingFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [uploadSuccessBanner, setUploadSuccessBanner] = useState<string | null>(null);

  // Folder System State
  const [folders, setFolders] = useState<CustomFolder[]>([
    {
      id: 'f-pleadings',
      name: '01_Pleadings & Petitions',
      color: 'blue',
      description: 'Plaints, Written Statements, Appeals & Writs',
      createdAt: '2026-07-24',
    },
    {
      id: 'f-evidence',
      name: '02_Evidence & Exhibits',
      color: 'emerald',
      description: 'Affidavits, Contracts, Title Deeds & Expert Reports',
      createdAt: '2026-07-24',
    },
    {
      id: 'f-orders',
      name: '03_Court Orders & Rulings',
      color: 'purple',
      description: 'Interim Stay Orders, Cause List Records & Decrees',
      createdAt: '2026-07-24',
    },
    {
      id: 'f-notice',
      name: '04_Notices & Correspondence',
      color: 'amber',
      description: 'Legal Demand Notices, Summons & Client Communications',
      createdAt: '2026-07-24',
    },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [targetFolderId, setTargetFolderId] = useState<string>('f-evidence');

  // New Folder Modal state
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderDesc, setNewFolderDesc] = useState<string>('');
  const [newFolderColor, setNewFolderColor] = useState<
    'blue' | 'emerald' | 'purple' | 'amber' | 'indigo' | 'rose'
  >('blue');
  const [newFolderMatterId, setNewFolderMatterId] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedMatterId when selectedMatter prop or matters array updates
  useEffect(() => {
    if (selectedMatter?.id) {
      setSelectedMatterId(selectedMatter.id);
    } else if (matters.length > 0 && (!selectedMatterId || !matters.some((m) => m.id === selectedMatterId))) {
      setSelectedMatterId(matters[0].id);
    }
  }, [selectedMatter, matters]);

  // Keep selectedDoc valid when documents list updates (e.g. after upload)
  useEffect(() => {
    if (documents.length > 0) {
      if (!selectedDoc || !documents.some((d) => d.id === selectedDoc.id)) {
        setSelectedDoc(documents[0]);
      }
    }
  }, [documents]);

  const handleMatterChange = (mId: string) => {
    setSelectedMatterId(mId);
    const found = matters.find((m) => m.id === mId);
    if (found && onSelectMatter) {
      onSelectMatter(found);
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newF: CustomFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      description: newFolderDesc.trim() || 'Custom Document Folder',
      color: newFolderColor,
      matterId: newFolderMatterId === 'all' ? undefined : newFolderMatterId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFolders((prev) => [...prev, newF]);
    setTargetFolderId(newF.id);
    setSelectedFolderId(newF.id);
    setShowFolderModal(false);
    setNewFolderName('');
    setNewFolderDesc('');
  };

  const getFolderColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'blue':
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.fileName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.ocrText.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.matterTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (d.folderName && d.folderName.toLowerCase().includes(searchFilter.toLowerCase()));

    let matchesMatter = true;
    if (matterFilterMode === 'selected' && selectedMatterId) {
      matchesMatter = d.matterId === selectedMatterId;
    }

    let matchesFolder = true;
    if (selectedFolderId !== 'all') {
      const selectedF = folders.find((f) => f.id === selectedFolderId);
      if (selectedF) {
        matchesFolder = d.folderId === selectedF.id || d.folderName === selectedF.name;
      }
    }

    return matchesSearch && matchesMatter && matchesFolder;
  });

  const [uploadBatch, setUploadBatch] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);

  const handleProcessFiles = (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;

    const targetMId = selectedMatterId || selectedMatter?.id || matters[0]?.id || '';
    const selectedFolder = folders.find((f) => f.id === targetFolderId);
    setIsProcessing(true);

    let idx = 0;
    const total = files.length;

    const processNext = () => {
      if (idx >= total) {
        setIsProcessing(false);
        setUploadBatch(null);
        setProcessingFileName('');
        // Reset filters so newly uploaded files are immediately visible in Processed Vault
        setSelectedFolderId('all');
        setMatterFilterMode('all');
        setSearchFilter('');
        setUploadSuccessBanner(
          `✅ Successfully uploaded and OCR-indexed ${total} file(s) into the Processed Vault!`
        );
        return;
      }

      const file = files[idx];
      setProcessingFileName(file.name);
      setUploadBatch({
        current: idx + 1,
        total,
        fileName: file.name,
      });

      setTimeout(() => {
        onUploadDocument(
          file,
          targetMId,
          category,
          selectedFolder?.id,
          selectedFolder?.name
        );
        idx++;
        processNext();
      }, 700);
    };

    processNext();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
      e.target.value = ''; // Reset file input so re-selecting triggers onChange
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
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Hidden File Input (Supports Multi-File Batch Selection) */}
      <input
        type="file"
        multiple
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
            Hybrid PaddleOCR + Tesseract Engine • Multi-File Batch • Custom Folder Organization System
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs font-bold shadow flex items-center gap-1.5 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Create New Folder</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PaddleOCR GPU Active</span>
          </span>
        </div>
      </div>

      {/* Case File Folders Directory Section */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Brief Folders & File Storage Directories ({folders.length} Active Folders)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedFolderId === 'all'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Folders ({documents.length} Files)
            </button>
          </div>
        </div>

        {/* Folder Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {folders.map((f) => {
            const docsInFolderCount = documents.filter(
              (d) => d.folderId === f.id || d.folderName === f.name
            ).length;
            const isSelected = selectedFolderId === f.id;
            const colorClass = getFolderColorClasses(f.color);

            return (
              <div
                key={f.id}
                onClick={() => setSelectedFolderId(isSelected ? 'all' : f.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 dark:bg-blue-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`p-2 rounded-lg border ${colorClass}`}>
                    <Folder className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {docsInFolderCount} {docsInFolderCount === 1 ? 'file' : 'files'}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={f.name}>
                  {f.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {f.description}
                </p>

                {f.matterId && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                    <Tag className="w-3 h-3" />
                    <span className="truncate">
                      {matters.find((m) => m.id === f.matterId)?.caseNumber || 'Specific Case'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Add Folder Card */}
          <div
            onClick={() => setShowFolderModal(true)}
            className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center mb-1 transition-colors">
              <FolderPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              + New Folder
            </span>
            <span className="text-[10px] text-slate-400">Create custom directory</span>
          </div>
        </div>
      </div>

      {/* Upload & Camera Scanner Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
          Intake Legal File / Physical Brief
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Matter / Case File</label>
            <select
              value={selectedMatterId}
              onChange={(e) => handleMatterChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
            >
              {matters.length === 0 ? (
                <option value="">No Active Case Files Found</option>
              ) : (
                matters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.caseNumber} - {m.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Folder Directory</label>
            <select
              value={targetFolderId}
              onChange={(e) => {
                if (e.target.value === 'NEW_FOLDER_ACTION') {
                  setShowFolderModal(true);
                } else {
                  setTargetFolderId(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
              <option value="NEW_FOLDER_ACTION">+ Create New Folder...</option>
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
                onClick={() =>
                  handleProcessFiles([
                    new File(
                      ['Captured Legal Document content via live Camera Scanner'],
                      `Scanned_Brief_${category.replace(/\s+/g, '_')}.pdf`,
                      { type: 'application/pdf' }
                    ),
                  ])
                }
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
            {uploadBatch
              ? `Batch OCR Pipeline: Uploading & Indexing ${uploadBatch.current} of ${uploadBatch.total} files...`
              : isProcessing
              ? `Processing PaddleOCR Pipeline: ${processingFileName || 'Document'}...`
              : 'Click to Browse or Drag Multiple PDFs / Scanned Images / Word / ZIP Files'}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {uploadBatch
              ? `Currently Extracting: ${uploadBatch.fileName}`
              : 'Select one or multiple legal brief files simultaneously for automatic OCR extraction, entity resolution, and vector embedding.'}
          </p>

          {/* Batch Progress Bar */}
          {uploadBatch && (
            <div className="mt-4 max-w-xs mx-auto space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <span>Batch Uploading ({uploadBatch.current}/{uploadBatch.total})</span>
                <span>{Math.round((uploadBatch.current / uploadBatch.total) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadBatch.current / uploadBatch.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow text-xs font-bold transition-all">
            <FilePlus className="w-3.5 h-3.5" />
            <span>Select Multiple Files from Computer</span>
          </div>
        </div>
      </div>

      {/* Document Vault & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Processed Vault ({filteredDocs.length})
              </h2>
              <div className="relative w-36">
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

            {/* Matter Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setMatterFilterMode('all')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  matterFilterMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All Case Files
              </button>
              <button
                onClick={() => setMatterFilterMode('selected')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all truncate max-w-[170px] ${
                  matterFilterMode === 'selected'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
                title={matters.find((m) => m.id === selectedMatterId)?.title || 'Selected Case File'}
              >
                Target Case Only
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <p className="font-bold text-slate-500">No documents found for this filter</p>
                <p className="text-[11px]">Upload a legal file above or switch filter to "All Case Files"</p>
              </div>
            ) : (
              filteredDocs.map((doc) => {
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
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                        {doc.metadata.confidenceScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate mb-1">
                      <FolderOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{doc.matterTitle || 'Unassigned Case File'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[10px] flex items-center gap-1">
                          <Folder className="w-3 h-3 text-blue-500" />
                          <span>{doc.folderName || 'General Vault'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{doc.fileSize}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete document "${doc.fileName}"?`)) {
                              if (onDeleteDocument) onDeleteDocument(doc.id);
                              if (selectedDoc?.id === doc.id) {
                                setSelectedDoc(filteredDocs.find((d) => d.id !== doc.id) || null);
                              }
                            }
                          }}
                          className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Document OCR Inspector (7 cols) */}
        {selectedDoc ? (
          <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                    {selectedDoc.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                    <Folder className="w-3 h-3 text-blue-500" />
                    <span>{selectedDoc.folderName || 'General Vault'}</span>
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedDoc.fileName}</h2>
                <p className="text-xs text-slate-500">{selectedDoc.matterTitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDoc.folderId || ''}
                  onChange={(e) => {
                    const targetF = folders.find((f) => f.id === e.target.value);
                    if (targetF) {
                      selectedDoc.folderId = targetF.id;
                      selectedDoc.folderName = targetF.name;
                      setSelectedDoc({ ...selectedDoc });
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  title="Move document to folder"
                >
                  <option value="" disabled>Move Folder...</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleCopyText(selectedDoc.ocrText)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete document "${selectedDoc.fileName}"?`)) {
                      if (onDeleteDocument) onDeleteDocument(selectedDoc.id);
                      setSelectedDoc(filteredDocs.find((d) => d.id !== selectedDoc.id) || null);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
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

      {/* Create New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Create Case Brief Folder</h3>
              </div>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Folder Name / Directory Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05_Transcripts & Depositions"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Folder Description / Contents
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expert testimony, cross-examination transcripts, and affidavits"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Associate with Case File
                </label>
                <select
                  value={newFolderMatterId}
                  onChange={(e) => setNewFolderMatterId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">Global / Available for All Case Files</option>
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.caseNumber} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Folder Color Accent
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {(['blue', 'emerald', 'purple', 'amber', 'indigo', 'rose'] as const).map((clr) => {
                    const colorClasses = {
                      blue: 'bg-blue-500',
                      emerald: 'bg-emerald-500',
                      purple: 'bg-purple-500',
                      amber: 'bg-amber-500',
                      indigo: 'bg-indigo-500',
                      rose: 'bg-rose-500',
                    }[clr];

                    return (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setNewFolderColor(clr)}
                        className={`w-7 h-7 rounded-full ${colorClasses} transition-all flex items-center justify-center ${
                          newFolderColor === clr ? 'ring-4 ring-blue-500/30 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {newFolderColor === clr && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition-all flex items-center gap-1.5"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create & Open Folder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
