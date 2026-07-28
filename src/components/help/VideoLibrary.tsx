import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Search, Clock, Video, Eye, Upload, Plus, X, Sparkles, Check, Trash2, Film, Link2 } from 'lucide-react';
import { HelpVideo, LanguageCode } from '../../types/helpTypes';

interface VideoLibraryProps {
  videos: HelpVideo[];
  currentLang: LanguageCode;
  onAddVideo?: (video: HelpVideo) => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ videos: propVideos, currentLang, onAddVideo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<HelpVideo | null>(null);
  
  // Custom uploaded videos state (merges props + localStorage)
  const [customVideos, setCustomVideos] = useState<HelpVideo[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for uploading/adding video
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('cat-getting-started');
  const [newDuration, setNewDuration] = useState('05:00');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoFilePreviewUrl, setVideoFilePreviewUrl] = useState<string>('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Load custom videos from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lawyerdesk_uploaded_videos');
      if (saved) {
        setCustomVideos(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading custom videos:', e);
    }
  }, []);

  // Combine initial seed videos with custom uploaded videos
  const allVideos = [...customVideos, ...propVideos];

  const toggleVideoCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedVideoIds.includes(id)) {
      setCompletedVideoIds(completedVideoIds.filter((v) => v !== id));
    } else {
      setCompletedVideoIds([...completedVideoIds, id]);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoFilePreviewUrl(url);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
  };

  const handlePublishVideo = async () => {
    if (!newTitle) {
      alert('Please enter a video title');
      return;
    }

    setIsProcessingUpload(true);
    let finalVideoUrl = newVideoUrl;

    if (uploadMode === 'file' && selectedVideoFile) {
      // Convert file to Data URL for client-side storage & offline viewing
      finalVideoUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedVideoFile);
      });
    } else if (uploadMode === 'url') {
      // Auto-convert standard YouTube watch URLs to embed format
      if (finalVideoUrl.includes('youtube.com/watch?v=')) {
        const videoId = finalVideoUrl.split('v=')[1]?.split('&')[0];
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (finalVideoUrl.includes('youtu.be/')) {
        const videoId = finalVideoUrl.split('youtu.be/')[1]?.split('?')[0];
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (!finalVideoUrl) {
      alert('Please select a video file or enter a valid video URL');
      setIsProcessingUpload(false);
      return;
    }

    const createdVideo: HelpVideo = {
      id: `custom-vid-${Date.now()}`,
      categoryId: newCategory,
      title: {
        en: newTitle,
        hi: newTitle,
        bn: newTitle,
      },
      description: {
        en: newDescription || 'Uploaded Custom Law Firm Training Demo Video.',
        hi: newDescription || 'अपलोड किया गया कस्टम ट्रेनिंग वीडियो।',
        bn: newDescription || 'আপলোড করা প্রশিক্ষণ ভিডিও।',
      },
      duration: newDuration || '05:00',
      videoUrl: finalVideoUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      viewsCount: 1,
      keywords: ['custom', 'training', 'upload', 'law firm', 'demo'],
    };

    const updatedCustoms = [createdVideo, ...customVideos];
    setCustomVideos(updatedCustoms);
    try {
      localStorage.setItem('lawyerdesk_uploaded_videos', JSON.stringify(updatedCustoms));
    } catch (err) {
      console.warn('Storage quota exceeded for large video data URL, saved to session state:', err);
    }

    if (onAddVideo) {
      onAddVideo(createdVideo);
    }

    setIsProcessingUpload(false);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewVideoUrl('');
    setSelectedVideoFile(null);
    setVideoFilePreviewUrl('');

    setToastMessage('✓ Video Tutorial Uploaded & Published to LawyerDesk Academy!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteCustomVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = customVideos.filter((v) => v.id !== id);
    setCustomVideos(filtered);
    localStorage.setItem('lawyerdesk_uploaded_videos', JSON.stringify(filtered));
    setToastMessage('✓ Video removed from library.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredVideos = allVideos.filter((v) => {
    const title = v.title[currentLang] || v.title.en;
    const desc = v.description[currentLang] || v.description.en;
    const search = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(search) ||
      desc.toLowerCase().includes(search) ||
      v.keywords.some((k) => k.toLowerCase().includes(search))
    );
  });

  const isDirectVideoFile = (url: string) => {
    return (
      url.startsWith('data:video/') ||
      url.startsWith('blob:') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.endsWith('.m4v')
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-xl border border-emerald-500 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Video className="w-3.5 h-3.5" /> LawyerDesk Video Training Academy
          </div>
          <h2 className="text-xl font-black">Interactive Video Tutorials & Demos</h2>
          <p className="text-xs text-slate-300">
            Watch step-by-step video guides for e-Courts cause list syncing, PaddleOCR, AI drafting, or upload custom training videos.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all active:scale-95"
            title="Upload your own custom MP4 or YouTube training video"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const title = video.title[currentLang] || video.title.en;
          const desc = video.description[currentLang] || video.description.en;
          const isCompleted = completedVideoIds.includes(video.id);
          const isCustom = video.id.startsWith('custom-vid-');

          return (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-indigo-500/60 transition-all hover:shadow-md relative"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {isDirectVideoFile(video.videoUrl) ? (
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    muted
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                )}

                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl backdrop-blur-sm">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-white font-mono text-[10px] font-bold flex items-center gap-1 border border-slate-700/60">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span>{video.duration}</span>
                </div>

                {isCustom && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 shadow-md border border-indigo-400/40">
                    <Film className="w-3 h-3 text-indigo-200" />
                    <span>Uploaded Tutorial</span>
                  </div>
                )}

                {isCompleted && !isCustom && (
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

                  <div className="flex items-center gap-2">
                    {isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustomVideo(video.id, e)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        title="Remove uploaded video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

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
            </div>
          );
        })}
      </div>

      {/* Modal: Upload Custom Video Tutorial */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col p-6 space-y-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Upload Video Tutorial</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add custom law firm walkthroughs, client orientation videos, or training guides.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setUploadMode('file')}
                className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'file'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Local MP4 / Video File</span>
              </button>
              <button
                onClick={() => setUploadMode('url')}
                className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  uploadMode === 'url'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>YouTube / Vimeo URL</span>
              </button>
            </div>

            {/* File Upload Box */}
            {uploadMode === 'file' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Video File (MP4, WebM, MOV)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center space-y-3 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                    id="custom-video-file-input"
                  />
                  <label
                    htmlFor="custom-video-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      {selectedVideoFile ? selectedVideoFile.name : 'Click to select or drag video file here'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Supports .mp4, .webm, .mov files up to 100MB
                    </span>
                  </label>

                  {videoFilePreviewUrl && (
                    <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black max-h-40 mx-auto">
                      <video src={videoFilePreviewUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL Link Box */}
            {uploadMode === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  YouTube / Vimeo / MP4 Web URL
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Video Details Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Tutorial Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High Court Cause List Sync & Advocate Portal Walkthrough"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of what clients or junior advocates will learn in this tutorial..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="cat-getting-started">Getting Started</option>
                    <option value="cat-cause-list">Cause List & eCourts</option>
                    <option value="cat-ocr-docs">PaddleOCR & Documents</option>
                    <option value="cat-ai-drafting">AI Drafting & Briefs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="05:30"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishVideo}
                disabled={isProcessingUpload}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessingUpload ? 'Publishing Video...' : 'Publish Video Tutorial'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Video Player */}
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

            {/* Render HTML5 video player if local video / DataURL / MP4, else render iframe for embeds */}
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              {isDirectVideoFile(selectedVideo.videoUrl) ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title.en}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
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

