export interface WebsiteLink {
  name: string;
  url: string;
}

export interface Channel {
  platform: 'Facebook' | 'YouTube' | 'TikTok';
  name: string;
  url: string;
}

export interface NicheData {
  websites?: WebsiteLink[];
  searchQueries?: string[];
  popularChannels?: Channel[];
}
