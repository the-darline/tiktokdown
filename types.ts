
export interface TikTokVideoData {
  id: string;
  title: string;
  cover: string;
  play: string;
  author: {
    nickname: string;
    unique_id: string;
    avatar: string;
  };
  duration: number;
  wmplay: string;
  music: string;
  music_info: {
    title: string;
    author: string;
  };
}

export interface ApiResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: TikTokVideoData;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  cover: string;
  timestamp: number;
  author: string;
}
