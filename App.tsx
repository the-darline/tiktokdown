
import React, { useState, useEffect } from 'react';
import { fetchTikTokInfo, isValidTikTokUrl } from './services/tiktokApi.ts';
import { TikTokVideoData, HistoryItem } from './types.ts';
import VideoCard from './components/VideoCard.tsx';
import History from './components/History.tsx';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<TikTokVideoData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('toksave_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('toksave_history', JSON.stringify(history.slice(0, 15)));
  }, [history]);

  const addToHistory = (data: TikTokVideoData, originalUrl: string) => {
    const newItem: HistoryItem = {
      id: data.id || Math.random().toString(36).substr(2, 9),
      url: originalUrl,
      title: data.title || 'TikTok Video',
      cover: data.cover,
      timestamp: Date.now(),
      author: data.author?.unique_id || 'tiktok_user',
    };
    
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== newItem.id);
      return [newItem, ...filtered].slice(0, 15);
    });
  };

  const handleDownload = async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) return;

    if (!isValidTikTokUrl(finalUrl)) {
      setError('Invalid link. Please copy a valid TikTok URL (e.g., https://www.tiktok.com/@user/video/...)');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const response = await fetchTikTokInfo(finalUrl);
      if (response && response.data) {
        setVideoData(response.data);
        addToHistory(response.data, finalUrl);
        if (!targetUrl) setUrl('');
      } else {
        throw new Error("Could not find video data in the response.");
      }
    } catch (err: any) {
      console.error('Application level error:', err);
      setError(err.message || 'The video could not be retrieved. Please ensure the TikTok link is public and valid.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear your download history?')) {
      setHistory([]);
      localStorage.removeItem('toksave_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 px-4">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-1/2 h-1/2 bg-[#ff0050]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-1/2 h-1/2 bg-[#00f2ea]/5 rounded-full blur-[100px]"></div>
      </div>

      <header className="w-full max-w-4xl pt-12 pb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => { setVideoData(null); setError(null); setUrl(''); }}>
          <div className="tiktok-gradient p-2.5 rounded-2xl shadow-lg shadow-cyan-500/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white italic">TokSave</h1>
        </div>
        <p className="text-slate-400 font-medium text-center">Fast, clean, watermark-free TikTok downloads</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff0050] to-[#00f2ea] rounded-[30px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[28px] p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-5 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder="Paste TikTok video link here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-4 pl-12 text-lg outline-none"
              />
            </div>
            <button 
              onClick={() => handleDownload()}
              disabled={loading || !url.trim()}
              className={`px-8 py-4 rounded-[22px] font-bold transition-all flex items-center justify-center gap-2 ${
                loading || !url.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-950 hover:bg-slate-100 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-4">
              <div className="bg-red-500/20 p-2 rounded-xl h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-100">Download Failed</p>
                <p className="text-sm opacity-80 leading-relaxed mt-0.5">{error}</p>
                <div className="flex gap-4 mt-3">
                  <button 
                    onClick={() => setError(null)}
                    className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 underline underline-offset-4"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => handleDownload()}
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {videoData ? (
          <VideoCard data={videoData} />
        ) : !loading && !error && (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl px-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">1</div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Copy link</p>
                <p className="text-xs mt-1">Share &gt; Copy Link in TikTok</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">2</div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Paste here</p>
                <p className="text-xs mt-1">Drop the URL above</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">3</div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Save video</p>
                <p className="text-xs mt-1">Get high quality, no tags</p>
              </div>
            </div>
          </div>
        )}

        <History items={history} onSelect={handleDownload} onClear={clearHistory} />
      </main>

      <footer className="mt-auto pt-16 text-slate-600 text-xs flex flex-col items-center gap-2">
        <p className="font-medium tracking-wide">SECURE • ANONYMOUS • UNLIMITED</p>
        <p>© 2024 TokSave Downloader</p>
      </footer>
    </div>
  );
};

export default App;
