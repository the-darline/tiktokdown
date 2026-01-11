
import React from 'react';
import { TikTokVideoData } from '../types.ts';

interface VideoCardProps {
  data: TikTokVideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ data }) => {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="md:flex">
        <div className="md:w-1/3 relative group">
          <img 
            src={data.cover} 
            alt={data.title} 
            className="w-full h-full object-cover aspect-[9/16]"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <a 
              href={data.play} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-xl p-4 rounded-full hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={data.author.avatar} 
                className="w-12 h-12 rounded-full border-2 border-[#ff0050]" 
                alt={data.author.nickname} 
              />
              <div>
                <h3 className="font-bold text-lg text-slate-100">{data.author.nickname}</h3>
                <p className="text-sm text-slate-400">@{data.author.unique_id}</p>
              </div>
            </div>

            <p className="text-slate-200 line-clamp-3 mb-6 text-lg leading-relaxed">
              {data.title || "No description available"}
            </p>

            <div className="bg-slate-900/50 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="font-medium truncate">{data.music_info.title} - {data.music_info.author}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleDownload(data.play, `tiktok_${data.id}_no_wm.mp4`)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#ff0050] hover:bg-[#e60048] text-white rounded-2xl font-bold transition-all shadow-lg shadow-[#ff0050]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              No Watermark
            </button>
            <button
              onClick={() => handleDownload(data.wmplay, `tiktok_${data.id}_wm.mp4`)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              With Watermark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
