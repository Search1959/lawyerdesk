import React, { useState } from 'react';
import { WalkthroughStep, LanguageCode } from '../../types/helpTypes';
import { Sparkles, ChevronRight, ChevronLeft, X, RotateCcw, CheckCircle2, Play } from 'lucide-react';

interface WalkthroughTourProps {
  steps: WalkthroughStep[];
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onCompleteTour: () => void;
}

export const WalkthroughTour: React.FC<WalkthroughTourProps> = ({
  steps,
  isOpen,
  onClose,
  currentLang,
  onCompleteTour,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen || steps.length === 0) return null;

  const activeStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const titleText = activeStep.title[currentLang] || activeStep.title.en;
  const descText = activeStep.description[currentLang] || activeStep.description.en;

  const handleNext = () => {
    if (isLastStep) {
      onCompleteTour();
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-indigo-500/80 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Top Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>LawyerDesk AI Interactive Tour</span>
            </span>
            <span>
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
          <div className="inline-flex px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold">
            {activeStep.badgeText || `Step ${activeStep.stepId}`}
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">{titleText}</h3>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{descText}</p>
        </div>

        {/* Controls Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 text-xs">
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold flex items-center gap-1 transition-colors"
            title="Restart Tour"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold transition-all"
            >
              Skip
            </button>

            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>{isLastStep ? 'Finish Tour' : 'Next'}</span>
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
