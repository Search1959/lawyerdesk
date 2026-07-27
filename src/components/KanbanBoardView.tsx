import React, { useState, useEffect } from 'react';
import { FolderKanban, Scale, AlertCircle, Sparkles, Filter, GripVertical, Move, Plus } from 'lucide-react';
import { Matter } from '../types';

const KANBAN_STAGES = [
  { id: 'Intake', label: '1. Intake', color: 'bg-slate-500', desc: 'New Matter Intake & Conflict Check' },
  { id: 'Consultation', label: '2. Consultation', color: 'bg-cyan-500', desc: 'Initial Client Legal Briefing' },
  { id: 'Retainer Signed', label: '3. Retainer Signed', color: 'bg-teal-500', desc: 'Vakalatnama & Engagement' },
  { id: 'Research', label: '4. Research', color: 'bg-sky-500', desc: 'Precedents & Statutory Analysis' },
  { id: 'Drafting', label: '5. Drafting', color: 'bg-indigo-500', desc: 'Pleadings & Annexures Drafted' },
  { id: 'Filed', label: '6. Filed', color: 'bg-blue-600', desc: 'Registry Verification & CNR' },
  { id: 'Notice Stage', label: '7. Notice Issued', color: 'bg-amber-500', desc: 'Summons & Notice Returnable' },
  { id: 'Active Litigation', label: '8. Hearing', color: 'bg-violet-500', desc: 'Interim Injunctions & Pleadings' },
  { id: 'Evidence Stage', label: '9. Evidence', color: 'bg-purple-600', desc: 'Chief & Cross-Examination' },
  { id: 'Arguments', label: '10. Arguments', color: 'bg-fuchsia-600', desc: 'Final Arguments Submitted' },
  { id: 'Pending Order', label: '11. Reserved', color: 'bg-rose-500', desc: 'Judgment Reserved by Court' },
  { id: 'Decreed', label: '12. Disposed', color: 'bg-emerald-600', desc: 'Decreed / Final Judgment' },
  { id: 'Appeal', label: '13. Appeal', color: 'bg-orange-600', desc: 'High Court / SLP Appeal' },
];

interface KanbanBoardViewProps {
  matters: Matter[];
  onSelectMatter?: (matter: Matter) => void;
  onOpenNewMatter?: () => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  matters: initialMatters,
  onSelectMatter,
  onOpenNewMatter,
}) => {
  const [matters, setMatters] = useState<Matter[]>(initialMatters);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [draggedMatterId, setDraggedMatterId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<string | null>(null);

  useEffect(() => {
    setMatters(initialMatters);
  }, [initialMatters]);

  const filteredMatters = matters.filter(m => filterCategory === 'All' || m.category === filterCategory);

  const handleStageChange = (matterId: string, newStage: Matter['status']) => {
    setMatters(matters.map(m => m.id === matterId ? { ...m, status: newStage } : m));
  };

  const handleDragStart = (e: React.DragEvent, matterId: string) => {
    e.dataTransfer.setData('text/plain', matterId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedMatterId(matterId);
  };

  const handleDragEnd = () => {
    setDraggedMatterId(null);
    setActiveDropStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropStage !== stageId) {
      setActiveDropStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (activeDropStage === stageId) {
      setActiveDropStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const matterId = e.dataTransfer.getData('text/plain') || draggedMatterId;
    if (!matterId) return;

    setMatters(prev => prev.map(m => {
      if (m.id !== matterId) return m;

      let updatedStatus = targetStageId as any;
      let updatedCategory = m.category;

      return { ...m, status: updatedStatus, category: updatedCategory };
    }));

    setDraggedMatterId(null);
    setActiveDropStage(null);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <FolderKanban className="w-4 h-4" /> Litigation Stage Pipeline
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Case Progression Kanban</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>Visual pipeline tracking court cases across Notice, Pleadings, Evidence, and Judgment stages.</span>
            <span className="hidden sm:inline-block bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded text-xs font-bold border border-indigo-100 dark:border-indigo-900/40">
              💡 Drag & Drop cards to move cases
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="All">All Categories</option>
            <option value="Civil">Civil</option>
            <option value="Criminal">Criminal</option>
            <option value="Company & Insolvency">Company & Insolvency</option>
            <option value="GST & Indirect Tax">GST & Indirect Tax</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {KANBAN_STAGES.map((stage) => {
          const stageMatters = filteredMatters.filter((m) => {
            if (stage.id === 'Notice Stage') return m.status === 'Notice Stage';
            if (stage.id === 'Active Litigation') return m.status === 'Active Litigation';
            if (stage.id === 'Evidence Stage') return m.status === 'Pending Order' && m.category === 'Criminal';
            if (stage.id === 'Pending Order') return m.status === 'Pending Order' && m.category !== 'Criminal';
            if (stage.id === 'Decreed') return m.status === 'Decreed' || m.status === 'Settled';
            return false;
          });

          const isDropTarget = activeDropStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`rounded-xl p-3 border transition-all flex flex-col min-h-[520px] ${
                isDropTarget
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/30 scale-[1.01]'
                  : 'bg-slate-100/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {stage.label}
                  </span>
                </div>
                <span className="text-xs bg-slate-200 dark:bg-slate-800 font-extrabold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {stageMatters.length}
                </span>
              </div>

              {/* Cards inside Stage */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageMatters.length === 0 ? (
                  <div className={`text-center py-12 text-xs font-semibold rounded-xl border border-dashed transition-colors ${
                    isDropTarget
                      ? 'border-indigo-400 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300 bg-indigo-100/40 dark:bg-indigo-900/30'
                      : 'border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                  }`}>
                    {isDropTarget ? '✨ Drop case here' : 'No cases in this stage'}
                  </div>
                ) : (
                  stageMatters.map((m) => {
                    const isDragging = draggedMatterId === m.id;

                    return (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-3 cursor-grab active:cursor-grabbing group relative select-none ${
                          isDragging ? 'opacity-40 scale-95 border-indigo-500 shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400 shrink-0 cursor-grab" />
                            <span className="font-mono text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/60">
                              {m.caseNumber}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              m.riskLevel === 'High'
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                : m.riskLevel === 'Medium'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            }`}
                          >
                            {m.riskLevel} Risk
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                          {m.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <div className="truncate font-medium text-slate-700 dark:text-slate-300">
                            🏛️ {m.court}
                          </div>
                          <div className="truncate">
                            👤 Client: <strong className="text-slate-800 dark:text-slate-200">{m.clientName}</strong>
                          </div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                            📅 Next Hearing: {m.nextHearingDate}
                          </div>
                        </div>

                        {/* Advance Stage Dropdown Action */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold flex items-center gap-1">
                            <Move className="w-2.5 h-2.5" /> Stage
                          </span>
                          <select
                            value={m.status}
                            onChange={(e) => handleStageChange(m.id, e.target.value as any)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-1 font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                          >
                            <option value="Notice Stage">Notice Stage</option>
                            <option value="Active Litigation">Active Litigation</option>
                            <option value="Pending Order">Pending Order</option>
                            <option value="Decreed">Decreed / Settled</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

