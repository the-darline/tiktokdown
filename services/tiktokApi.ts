
import { ApiResponse, TikTokVideoData } from '../types';

// RapidAPI Configuration
// On Vercel, you can set VITE_RAPID_API_KEY in the environment variables dashboard.
const RAPID_API_KEY = (typeof process !== 'undefined' && process.env.VITE_RAPID_API_KEY) || '3a4093e775mshf5263a482b3a086p17de27jsn7056d14fa1e2';
const RAPID_API_HOST = 'tiktok-download-video-no-watermark.p.rapidapi.com';
const BASE_URL = 'https://tiktok-download-video-no-watermark.p.rapidapi.com/tiktok/info';

/**
 * Fetches TikTok video information using RapidAPI.
 * Uses 'credentials: include' to match 'xhr.withCredentials = true' as per working documentation.
 */
export const fetchTikTokInfo = async (url: string): Promise<ApiResponse> => {
  const cleanUrl = url.trim();
  const encodedUrl = encodeURIComponent(cleanUrl);
  
  console.log('TokSave: Fetching info for', cleanUrl);

  try {
    const response = await fetch(`${BASE_URL}?url=${encodedUrl}`, {
      method: 'GET',
      credentials: 'include', // Direct translation of xhr.withCredentials = true
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TokSave: RapidAPI HTTP Error', response.status, errorText);
      throw new Error(`API Connection Failed (${response.status}). The service might be under maintenance.`);
    }

    const result = await response.json();
    console.log('TokSave: Raw API Response Received', result);

    // Deep extraction logic to support all known RapidAPI response versions
    let videoData: any = null;
    
    if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
      videoData = result.data;
    } else if (result.play || result.id || result.video_link_nwm) {
      videoData = result;
    }

    // Try multiple possible keys for the video URL found in various API updates
    const playUrl = videoData?.video_link_nwm_hd || 
                    videoData?.video_link_nwm || 
                    videoData?.play || 
                    videoData?.url;
                    
    const wmUrl = videoData?.video_link_wm || 
                  videoData?.wmplay || 
                  playUrl;

    if (videoData && playUrl) {
      const normalizedData: TikTokVideoData = {
        id: videoData._id || videoData.id || videoData.aweme_id || String(Date.now()),
        title: videoData.title || videoData.desc || "TikTok Video",
        cover: videoData.cover || videoData.origin_cover || "",
        play: playUrl,
        wmplay: wmUrl,
        duration: videoData.duration || 0,
        music: typeof videoData.music === 'string' ? videoData.music : (videoData.music?.uri || ""),
        author: {
          nickname: videoData.author?.nickname || "TikTok User",
          unique_id: videoData.author?.unique_id || "tiktok_user",
          avatar: videoData.author?.avatar || "https://www.tiktok.com/favicon.ico",
        },
        music_info: {
          title: videoData.music_info?.title || videoData.music?.title || "Original Sound",
          author: videoData.music_info?.author || videoData.music?.author || "Unknown",
        }
      };

      return {
        code: 0,
        msg: "success",
        processed_time: result.processed_time || 0,
        data: normalizedData
      };
    }

    // Capture explicit error codes from the API payload
    if (result.msg || result.message) {
      throw new Error(result.msg || result.message);
    }

    throw new Error("Unable to extract video source. The video might be private or from a restricted region.");

  } catch (err: any) {
    console.error('TokSave: Fetch execution error', err);
    throw err;
  }
};

export const isValidTikTokUrl = (url: string): boolean => {
  const cleanUrl = url.trim();
  if (!cleanUrl) return false;
  // Broad match for all tiktok subdomains including short links (vt, vm)
  return /^(https?:\/\/)?((www|vm|vt|v|m)\.)?tiktok\.com\/.*$/i.test(cleanUrl);
};
