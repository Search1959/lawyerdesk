import React, { useState } from 'react';
import { HelpArticle, HelpCategory } from '../../types/helpTypes';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Archive,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Save,
  X,
  FileText,
  FolderPlus,
} from 'lucide-react';

interface HelpAdminPanelProps {
  articles: HelpArticle[];
  categories: HelpCategory[];
  onSaveArticle: (article: Partial<HelpArticle>) => void;
  onDeleteArticle: (articleId: string) => void;
  onSaveCategory: (category: Partial<HelpCategory>) => void;
}

export const HelpAdminPanel: React.FC<HelpAdminPanelProps> = ({
  articles,
  categories,
  onSaveArticle,
  onDeleteArticle,
  onSaveCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing modal states
  const [editingArticle, setEditingArticle] = useState<Partial<HelpArticle> | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const filteredArticles = articles.filter((a) => {
    const title = a.title.en.toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || a.categoryName.toLowerCase().includes(query);
  });

  const handleCreateNewArticle = () => {
    setEditingArticle({
      id: `art-${Date.now()}`,
      categoryId: categories[0]?.id || 'cat-1',
      categoryName: categories[0]?.code || 'General',
      title: { en: '', hi: '', bn: '' },
      shortDescription: { en: '', hi: '', bn: '' },
      content: { en: '', hi: '', bn: '' },
      keywords: ['legal', 'manual'],
      version: 'v3.6.2',
      lastUpdated: new Date().toISOString().split('T')[0],
      estimatedReadTimeMin: 3,
      viewsCount: 0,
      helpfulYesCount: 0,
      helpfulNoCount: 0,
      status: 'Published',
    });
  };

  const handleSaveArticleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title?.en) return;
    onSaveArticle(editingArticle);
    setEditingArticle(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onSaveCategory({
      id: `cat-${Date.now()}`,
      code: newCatName,
      name: { en: newCatName, hi: newCatName, bn: newCatName },
      description: { en: newCatDesc, hi: newCatDesc, bn: newCatDesc },
      iconName: 'BookOpen',
      order: categories.length + 1,
    });
    setNewCatName('');
    setNewCatDesc('');
    setShowCatModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> System Administration Panel
          </div>
          <h2 className="text-xl font-black">Help Center Knowledge Management</h2>
          <p className="text-xs text-slate-300">Create, publish, schedule, or archive help articles, FAQs, and categories.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span>+ Add Category</span>
          </button>
          <button
            onClick={handleCreateNewArticle}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Article</span>
          </button>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'articles'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Articles Directory ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Categories System ({categories.length})
        </button>
      </div>

      {activeTab === 'articles' ? (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles to edit..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Article Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Views</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{art.title.en}</td>
                    <td className="p-3.5 text-slate-500">{art.categoryName}</td>
                    <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{art.version}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        {art.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{art.viewsCount}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>{cat.name.en}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded">
                  {cat.code}
                </span>
              </div>
              <p className="text-xs text-slate-500">{cat.description.en}</p>
            </div>
          ))}
        </div>
      )}

      {/* Article Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Create / Edit Help Article</h3>
              <button onClick={() => setEditingArticle(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticleForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Article Title (EN)</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title?.en || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      title: { ...editingArticle.title, en: e.target.value, hi: e.target.value, bn: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={editingArticle.categoryId || categories[0]?.id}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.id === e.target.value);
                      setEditingArticle({
                        ...editingArticle,
                        categoryId: e.target.value,
                        categoryName: selected?.code || 'General',
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Version Number</label>
                  <input
                    type="text"
                    value={editingArticle.version || 'v3.6.2'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, version: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingArticle.shortDescription?.en || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      shortDescription: {
                        ...editingArticle.shortDescription,
                        en: e.target.value,
                        hi: e.target.value,
                        bn: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Article Markdown</label>
                <textarea
                  rows={5}
                  value={editingArticle.content?.en || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      content: { ...editingArticle.content, en: e.target.value, hi: e.target.value, bn: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black shadow-md">
                  Save & Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Category Code / Title</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Evidence Vault"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold uppercase mb-1">Description</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description of category contents..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black shadow-md">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
