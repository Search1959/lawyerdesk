import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  Command,
  ArrowRight,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenWestBengalSuite?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenWestBengalSuite,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  if (!isOpen) return null;

  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript(language === 'EN' ? 'Listening for voice command...' : 'ভয়েস কমান্ডের জন্য প্রস্তুত...');
      setResponseMessage('');

      setTimeout(() => {
        setIsListening(false);
        if (language === 'EN') {
          setTranscript('Show tomorrow\'s court hearings');
          setResponseMessage('Navigating to Court Hearings schedule...');
          setTimeout(() => {
            onClose();
            onNavigateTab('hearings');
          }, 1200);
        } else {
          setTranscript('আগামীকালের শুনানি দেখাও');
          setResponseMessage('আগামীকালের শুনানির সময়সূচী খোলা হচ্ছে...');
          setTimeout(() => {
            onClose();
            onNavigateTab('hearings');
          }, 1200);
        }
      }, 2200);
    }
  };

  const handleSelectQuickCommand = (cmdText: string, targetTab: NavTab) => {
    setTranscript(cmdText);
    setResponseMessage(`Executing command: ${cmdText}...`);
    setTimeout(() => {
      onClose();
      onNavigateTab(targetTab);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">LawyerDesk Voice AI Assistant</h3>
              <p className="text-[10px] text-slate-400">English & Bengali Voice Controls</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage((prev) => (prev === 'EN' ? 'BN' : 'EN'))}
              className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-300 flex items-center gap-1 hover:bg-slate-700 transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'EN' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Mic Pulse Area */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onClick={handleToggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all relative ${
              isListening
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 ring-8 ring-rose-500/30 scale-105 animate-pulse'
                : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:scale-105 hover:shadow-indigo-500/40'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>

          <div className="text-center space-y-1">
            <div className="text-sm font-bold text-slate-200">
              {isListening
                ? 'Listening to command...'
                : 'Tap Microphone to Speak'}
            </div>
            <div className="text-xs text-indigo-400 min-h-[20px] font-mono">
              {transcript || (language === 'EN' ? 'e.g. "Show tomorrow\'s hearings"' : 'যেমন "আগামীকালের শুনানি দেখাও"')}
            </div>
          </div>

          {responseMessage && (
            <div className="p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{responseMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Voice Commands */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sample Voice Commands:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleSelectQuickCommand('Show tomorrow\'s hearings', 'hearings')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left text-slate-200 hover:text-white transition-all flex items-center justify-between"
            >
              <span>{language === 'EN' ? '"Show tomorrow\'s hearings"' : '"আগামীকালের শুনানি দেখাও"'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            <button
              onClick={() => handleSelectQuickCommand('Open Kolkata court intelligence', 'court_intelligence')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left text-slate-200 hover:text-white transition-all flex items-center justify-between"
            >
              <span>{language === 'EN' ? '"Court Intelligence"' : '"কলকাতা কোর্ট ইন্টেলিজেন্স"'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            <button
              onClick={() => handleSelectQuickCommand('Draft legal notice', 'ai_drafting')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left text-slate-200 hover:text-white transition-all flex items-center justify-between"
            >
              <span>{language === 'EN' ? '"Draft Legal Notice"' : '"আইনি নোটিশ ড্রাফট করো"'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            <button
              onClick={() => handleSelectQuickCommand('Open West Bengal Suite', 'west_bengal_suite')}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left text-slate-200 hover:text-white transition-all flex items-center justify-between"
            >
              <span>{language === 'EN' ? '"Calculate Limitation Period"' : '"লিমিটেশন ক্যালকুলেটর"'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
