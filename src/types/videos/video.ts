export type Video = {
  title: string;
  url: string;
  cover: string;
  owner: string;
  pubDate: string;
  play: string;
  duration: string;
  platform: string;
};
export type HomeRcmdResp = {
  result: Array<Video>;
};
