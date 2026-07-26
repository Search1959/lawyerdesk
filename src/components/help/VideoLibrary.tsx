import React, { useState } from 'react';
import { Play, CheckCircle2, Search, Clock, Video, Eye, Filter, Sparkles, ExternalLink, X } from 'lucide-react';
import { HelpVideo, LanguageCode } from '../../types/helpTypes';

interface VideoLibraryProps {
  videos: HelpVideo[];
  currentLang: LanguageCode;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ videos, currentLang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<HelpVideo | null>(null);

  const toggleVideoCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedVideoIds.includes(id)) {
      setCompletedVideoIds(completedVideoIds.filter((v) => v !== id));
    } else {
      setCompletedVideoIds([...completedVideoIds, id]);
    }
  };

  const filteredVideos = videos.filter((v) => {
    const title = v.title[currentLang] || v.title.en;
    const desc = v.description[currentLang] || v.description.en;
    const search = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(search) ||
      desc.toLowerCase().includes(search) ||
      v.keywords.some((k) => k.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Video className="w-3.5 h-3.5" /> LawyerDesk Video Training Academy
          </div>
          <h2 className="text-xl font-black">Interactive Video Tutorials & Demos</h2>
          <p className="text-xs text-slate-300">
            Watch step-by-step video guides for e-Courts cause list syncing, PaddleOCR, AI drafting, and GST invoices.
          </p>
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const title = video.title[currentLang] || video.title.en;
          const desc = video.description[currentLang] || video.description.en;
          const isCompleted = completedVideoIds.includes(video.id);

          return (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-indigo-500/60 transition-all hover:shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />

                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl backdrop-blur-sm">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-white font-mono text-[10px] font-bold flex items-center gap-1 border border-slate-700/60">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>{video.duration}</span>
                </div>

                {isCompleted && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600/90 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{desc}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{video.viewsCount} views</span>
                  </div>

                  <button
                    onClick={(e) => toggleVideoCompleted(video.id, e)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {isCompleted ? 'Mark Unwatched' : 'Mark Watched'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <div className="font-bold text-sm truncate pr-4">
                {selectedVideo.title[currentLang] || selectedVideo.title.en}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title.en}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 text-slate-200 text-xs space-y-2">
              <p>{selectedVideo.description[currentLang] || selectedVideo.description.en}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
